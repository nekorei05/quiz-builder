// backend/routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAdminAnalytics } = require("../controllers/analyticsController");
const Result = require("../models/Result");

// GET /api/analytics/admin
router.get("/admin", protect, authorize("admin"), getAdminAnalytics);

// GET /api/analytics/student
router.get("/student", protect, authorize("student"), async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate("quizId", "title subject")
      .sort({ createdAt: 1 })
      .lean();

    if (!results.length) {
      return res.json({
        totalAttempts: 0,
        uniqueQuizzes: 0,
        avgScore: 0,
        improvement: 0,
        scoreTrend: [],
        perQuiz: [],
      });
    }

    const totalAttempts = results.length;
    const uniqueQuizzes = new Set(results.map(r => String(r.quizId?._id || r.quizId))).size;
    const avgScore = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);

    // Improvement: last attempt vs first attempt
    const improvement = results.length >= 2
      ? Math.round(results[results.length - 1].percentage - results[0].percentage)
      : 0;

    // Score trend — one point per attempt
    const scoreTrend = results.map((r, i) => ({
      name: r.quizId?.title
        ? r.quizId.title.length > 12 ? r.quizId.title.slice(0, 12) + "…" : r.quizId.title
        : `Attempt ${i + 1}`,
      score: r.percentage,
    }));

    // Per quiz — best score per quiz + attempt count
    const quizMap = {};
    results.forEach((r) => {
      const id = String(r.quizId?._id || r.quizId);
      const title = r.quizId?.title || "Unknown";
      if (!quizMap[id]) quizMap[id] = { name: title, score: 0, attempts: 0 };
      if (r.percentage > quizMap[id].score) quizMap[id].score = r.percentage;
      quizMap[id].attempts += 1;
    });
    const perQuiz = Object.values(quizMap);

    return res.json({ totalAttempts, uniqueQuizzes, avgScore, improvement, scoreTrend, perQuiz });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch student analytics" });
  }
});

module.exports = router;