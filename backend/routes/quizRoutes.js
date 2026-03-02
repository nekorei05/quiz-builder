const express = require('express');
const router = express.Router();

// ai generate
const upload = require("../middleware/uploadMiddleware");
const { aiGenerateQuiz } = require("../controllers/quizController");


const {
  createQuiz,
  getPublishedQuizzes,
  getMyQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizHistory,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ── ADMIN ──────────────────────────────────────────────
router.post('/', protect, authorize('admin'), createQuiz);
router.get('/admin', protect, authorize('admin'), getMyQuizzes);
router.put('/:id', protect, authorize('admin'), updateQuiz);
router.delete('/:id', protect, authorize('admin'), deleteQuiz);

// ── STUDENT ────────────────────────────────────────────
router.get('/history', protect, authorize('student'), getQuizHistory);
router.get('/', protect, authorize('student'), getPublishedQuizzes);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

// ── AI GENERATE ───────────────────────────
router.post("/ai-generate",protect, authorize("admin"), upload.single("file"), aiGenerateQuiz);

// ── SHARED (admin + student) ───────────────────────────
// Admin needs this to prefill EditQuiz, student needs it to attempt quiz
router.get('/:id', protect, authorize('admin', 'student'), getQuizById);  // ✅ was student-only


module.exports = router;