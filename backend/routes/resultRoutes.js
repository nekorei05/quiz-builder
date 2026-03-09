const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const Result = require("../models/Result");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// GET /api/results/:resultId — student fetches their own result
router.get("/:resultId", protect, authorize("student", "admin"), async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId).lean();
    if (!result) return res.status(404).json({ message: "Result not found" });

    // Students can only see their own results
    if (req.user.role === "student" && String(result.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const quiz = await Quiz.findById(result.quizId).lean();
    const questions = await Question.find({ quizId: result.quizId }).lean();

    return res.json({ result, quiz, questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch result" });
  }
});

module.exports = router;