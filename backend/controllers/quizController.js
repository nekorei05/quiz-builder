const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

/*
@desc    Create quiz with questions
@route   POST /api/quizzes
@access  Admin only
*/
exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      difficultyLevel,
      timeLimit,
      totalMarks,
      questions
    } = req.body;

    // Basic validation
    if (!questions || questions.length === 0) {
      return res.status(400).json({
        message: "Quiz must contain at least one question"
      });
    }

    // 1️⃣ Create Quiz
   const quiz = await Quiz.create({
  title,
  description,
  subject,
  difficultyLevel,
  timeLimit,
  totalMarks,
  createdBy: req.user._id,
  isPublished: true
});

    // 2️⃣ Prepare questions with quizId
    const formattedQuestions = questions.map((q) => ({
      quizId: quiz._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty
    }));

    // 3️⃣ Insert all questions
    await Question.insertMany(formattedQuestions);

    res.status(201).json({
      message: "Quiz created successfully",
      quizId: quiz._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while creating quiz"
    });
  }
};


/*
@desc    Get all published quizzes (Student)
@route   GET /api/quizzes
@access  Student only
*/
exports.getPublishedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true })
      .select("-__v")
      .populate("createdBy", "name");

    res.json(quizzes);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching quizzes"
    });
  }
};


// GET /api/quizzes/admin  (admin: list quizzes created by me)
exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .select('-__v')
      .sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while fetching my quizzes' });
  }
};