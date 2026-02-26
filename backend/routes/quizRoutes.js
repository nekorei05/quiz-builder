const express = require("express");
const router = express.Router();

const { createQuiz, getPublishedQuizzes } = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Admin creates quiz
router.post("/", protect, authorize("admin"), createQuiz);

// Student gets published quizzes
router.get("/", protect, authorize("student"), getPublishedQuizzes);

module.exports = router;