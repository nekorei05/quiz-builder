// backend/controllers/analyticsController.js
const Result = require("../models/Result");
const Quiz = require("../models/Quiz");
const User = require("../models/User");

/*
@desc  Admin: get full analytics across all their quizzes
@route GET /api/analytics/admin
*/
exports.getAdminAnalytics = async (req, res) => {
  try {
    // Get all quizzes belonging to this admin
    const quizzes = await Quiz.find({ createdBy: req.user._id }).lean();
    const quizIds = quizzes.map((q) => q._id);

    if (!quizIds.length) {
      return res.json({
        totalAttempts: 0,
        activeStudents: 0,
        avgAccuracy: 0,
        perfectScores: 0,
        scoreTrend: [],
        perQuiz: [],
        topStudents: [],
      });
    }

    // Get all results for admin's quizzes
    const results = await Result.find({ quizId: { $in: quizIds } })
      .populate("userId", "name email")
      .populate("quizId", "title")
      .sort({ createdAt: 1 })
      .lean();

    if (!results.length) {
      return res.json({
        totalAttempts: 0,
        activeStudents: 0,
        avgAccuracy: 0,
        perfectScores: 0,
        scoreTrend: [],
        perQuiz: [],
        topStudents: [],
      });
    }

    // ── Stat Cards ─────────────────────────────────────────
    const totalAttempts = results.length;

    const activeStudents = new Set(results.map((r) => String(r.userId?._id || r.userId))).size;

    const avgAccuracy = Math.round(
      results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
    );

    const perfectScores = results.filter((r) => r.score === r.total).length;

    // ── Score Trend (by date) ──────────────────────────────
    // Group attempts by date, average percentage per day
    const byDate = {};
    results.forEach((r) => {
      const date = new Date(r.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric"
      });
      if (!byDate[date]) byDate[date] = { total: 0, count: 0 };
      byDate[date].total += r.percentage || 0;
      byDate[date].count += 1;
    });

    const scoreTrend = Object.entries(byDate).map(([name, val]) => ({
      name,
      score: Math.round(val.total / val.count),
      accuracy: Math.round(val.total / val.count),
    }));

    // ── Per Quiz Stats ─────────────────────────────────────
    const quizMap = {};
    results.forEach((r) => {
      const id = String(r.quizId?._id || r.quizId);
      const title = r.quizId?.title || "Unknown Quiz";
      if (!quizMap[id]) quizMap[id] = { name: title, total: 0, count: 0, perfect: 0 };
      quizMap[id].total += r.percentage || 0;
      quizMap[id].count += 1;
      if (r.score === r.total) quizMap[id].perfect += 1;
    });

    const perQuiz = Object.values(quizMap).map((q) => ({
      name: q.name,
      avgScore: Math.round(q.total / q.count),
      attempts: q.count,
      perfectScores: q.perfect,
    }));

    // ── Top Students ───────────────────────────────────────
    const studentMap = {};
    results.forEach((r) => {
      const id = String(r.userId?._id || r.userId);
      const name = r.userId?.name || "Unknown";
      const email = r.userId?.email || "";
      if (!studentMap[id]) studentMap[id] = { name, email, total: 0, count: 0 };
      studentMap[id].total += r.percentage || 0;
      studentMap[id].count += 1;
    });

    const topStudents = Object.values(studentMap)
      .map((s) => ({ name: s.name, email: s.email, avgScore: Math.round(s.total / s.count), attempts: s.count }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);

    return res.json({
      totalAttempts,
      activeStudents,
      avgAccuracy,
      perfectScores,
      scoreTrend,
      perQuiz,
      topStudents,
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ message: "Failed to fetch analytics" });
  }
};