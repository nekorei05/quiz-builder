const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Result = require("../models/Result");
const parseFile = require("../utils/parseFile");
const { generateQuizFromText } = require("../services/aiService");


// ── CREATE ─────────────────────────────────────────────────────

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, subject, difficultyLevel, timeLimit, totalMarks, questions, isPublished } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "Quiz must contain at least one question" });
    }

    const quiz = await Quiz.create({
      title, description, subject, difficultyLevel, timeLimit, totalMarks,
      createdBy: req.user._id,
      isPublished: isPublished ?? false,  // use frontend value, default draft
    });

    const formatted = questions.map((q) => ({
      quizId: quiz._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: Number(q.correctAnswer),
      difficulty: q.difficulty || difficultyLevel,
    }));

    await Question.insertMany(formatted);

    return res.status(201).json({ message: "Quiz created successfully", quizId: quiz._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while creating quiz" });
  }
};

// ── READ ───────────────────────────────────────────────────────

exports.getPublishedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true }).select("-__v").lean();
    if (!quizzes.length) return res.json([]);

    const quizIds = quizzes.map((q) => q._id);
    const counts = await Question.aggregate([
      { $match: { quizId: { $in: quizIds } } },
      { $group: { _id: "$quizId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    for (const q of quizzes) q.questionCount = countMap.get(String(q._id)) || 0;

    return res.json(quizzes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while fetching quizzes" });
  }
};

exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    // Attach question counts for admin list
    const quizIds = quizzes.map((q) => q._id);
    const counts = await Question.aggregate([
      { $match: { quizId: { $in: quizIds } } },
      { $group: { _id: "$quizId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    for (const q of quizzes) q.questionCount = countMap.get(String(q._id)) || 0;

    return res.json(quizzes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while fetching my quizzes" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Admin sees correctAnswer, student doesn't
    const questions = await Question.find({ quizId: req.params.id })
      .select(req.user.role === "admin" ? "" : "-correctAnswer")
      .lean();

    return res.json({ quiz, questions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching quiz details" });
  }
};

// ── UPDATE ─────────────────────────────────────────────────────

/*
@desc  Admin: update quiz metadata + smart question sync
       - existing questions (have _id) → update in place
       - new questions (no _id) → insert
       - questions removed in frontend → delete from DB
@route PUT /api/quizzes/:id
*/
exports.updateQuiz = async (req, res) => {
  try {
    const { questions, ...metaFields } = req.body;

    // Verify ownership
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found or not authorized" });

    // 1. Update metadata
    const allowedFields = ["title", "description", "subject", "difficultyLevel", "timeLimit", "totalMarks", "isPublished"];
    allowedFields.forEach((field) => {
      if (metaFields[field] !== undefined) quiz[field] = metaFields[field];
    });
    await quiz.save();

    // 2. Sync questions if provided
    if (Array.isArray(questions)) {
      // IDs that still exist in the updated list
      const incomingIds = questions
        .filter((q) => q._id)
        .map((q) => String(q._id));

      // Delete questions that were removed in the frontend
      await Question.deleteMany({
        quizId: quiz._id,
        _id: { $nin: incomingIds },
      });

      // Process each question
      for (const q of questions) {
        const data = {
          questionText: q.questionText,
          options: q.options,
          correctAnswer: Number(q.correctAnswer),
          difficulty: q.difficulty || quiz.difficultyLevel,
        };

        if (q._id) {
          // Existing question → update it
          await Question.findByIdAndUpdate(q._id, data);
        } else {
          // New question → insert it
          await Question.create({ quizId: quiz._id, ...data });
        }
      }
    }

    // 3. Return fresh data
    const updatedQuestions = await Question.find({ quizId: quiz._id }).lean();

    return res.json({
      message: "Quiz updated successfully",
      quiz,
      questions: updatedQuestions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating quiz" });
  }
};

// ── DELETE ─────────────────────────────────────────────────────

/*
@desc  Admin: delete entire quiz + all its questions + results
@route DELETE /api/quizzes/:id
*/
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found or not authorized" });

    await Question.deleteMany({ quizId: quiz._id });
    await Result.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();

    return res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting quiz" });
  }
};

// ── SUBMIT ─────────────────────────────────────────────────────

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const questions = await Question.find({ quizId: quiz._id });

    let score = 0;
    const breakdown = questions.map((q, i) => {
      const selected = answers[i]?.selectedAnswer ?? answers[i];
      const isCorrect = Number(q.correctAnswer) === Number(selected);
      if (isCorrect) score++;
      return {
        questionId: q._id,
        questionText: q.questionText,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    const result = await Result.create({
      quizId: quiz._id,
      userId: req.user._id,
      score,
      total,
      percentage,
      breakdown,
    });

    return res.json({ score, total, percentage, resultId: result._id, breakdown });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error submitting quiz" });
  }
};

// ── HISTORY ────────────────────────────────────────────────────

exports.getQuizHistory = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate("quizId", "title subject difficultyLevel")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching history" });
  }
};

// ── AI GENERATE ─────────────────────────────────────────────

exports.aiGenerateQuiz = async (req, res) => {
  try {
    const { numberOfQuestions } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // 1️⃣ Extract text from uploaded file (THIS PART WORKS!)
    const extractedText = await parseFile(req.file);

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ message: "File content too small" });
    }

    // 2️⃣ ACTIVATE GEMINI (The part you were missing)
    // This calls your generateQuizFromText function in aiService.js
    const aiRawResponse = await generateQuizFromText(extractedText, numberOfQuestions || 5);

    // 3️⃣ Parse the AI string into JSON
    // We strip markdown backticks just in case
    const cleanJson = aiRawResponse.replace(/```json|```/g, "").trim();
    const quizData = JSON.parse(cleanJson);

    // 4️⃣ Return the ACTUAL questions
    return res.json({
      message: "Quiz generated successfully",
      ...quizData 
    });

  } catch (error) {
    console.error("AI Generate Error:", error);
    
    // Handle Gemini 429 (Rate Limit) specifically
    const status = error.message.includes("429") ? 429 : 500;
    const msg = status === 429 ? "AI is busy (Free Tier limit). Wait 60s." : "Error generating quiz";
    
    return res.status(status).json({ message: msg });
  }
};
