// controllers/quizController.js — COMPLETE UPDATED VERSION
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Result = require("../models/Result");

// ── EXISTING (unchanged) ───────────────────────────────────────

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, subject, difficultyLevel, timeLimit, totalMarks, questions } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "Quiz must contain at least one question" });
    }

    const quiz = await Quiz.create({
      title, description, subject, difficultyLevel, timeLimit, totalMarks,
      createdBy: req.user._id,
      isPublished: true,
    });

    const formattedQuestions = questions.map((q) => ({
      quizId: quiz._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
    }));

    await Question.insertMany(formattedQuestions);

    return res.status(201).json({ message: "Quiz created successfully", quizId: quiz._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while creating quiz" });
  }
};

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

   const questions = await Question.find({ quizId: req.params.id })
  .select(req.user.role === "admin" ? "" : "-correctAnswer")  // ✅ admin sees all
  .lean();

    return res.json({ quiz, questions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching quiz details" });
  }
};

// ── NEW FUNCTIONS ──────────────────────────────────────────────

/*
@desc    Admin: update a quiz (metadata only, not questions)
@route   PUT /api/quizzes/:id
@access  Admin only
*/
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, subject, difficultyLevel, timeLimit, totalMarks, questions } = req.body;

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found or not authorized" });
    }

    // ─── Update quiz metadata ───
    quiz.title = title;
    quiz.description = description;
    quiz.subject = subject;
    quiz.difficultyLevel = difficultyLevel;
    quiz.timeLimit = timeLimit;
    quiz.totalMarks = totalMarks;

    await quiz.save();

    // ─── Replace all questions ───
    await Question.deleteMany({ quizId: quiz._id });

    const formattedQuestions = questions.map((q) => ({
      quizId: quiz._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
    }));

    await Question.insertMany(formattedQuestions);

    return res.json({ message: "Quiz fully updated successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating quiz" });
  }
};

/*
@desc    Admin: delete a quiz and its questions
@route   DELETE /api/quizzes/:id
@access  Admin only
*/
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found or not authorized" });

    await Question.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();

    return res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting quiz" });
  }
};

/*
@desc    Student: submit answers and receive score
@route   POST /api/quizzes/:id/submit
@access  Student only
*/
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of { questionId, selectedAnswer (index) }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const questions = await Question.find({ quizId: quiz._id });

    let score = 0;
    const breakdown = questions.map((q, i) => {
      const selected = answers[i]?.selectedAnswer ?? answers[i];
      const isCorrect = q.correctAnswer === selected;
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

    // Save result to DB
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

/*
@desc    Student: get their attempt history
@route   GET /api/quizzes/history
@access  Student only
*/
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