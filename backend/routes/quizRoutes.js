// routes/quizRoutes.js — COMPLETE UPDATED VERSION
const express = require('express');
const router = express.Router();
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

// ── ADMIN ──────────────────────────────────────────────────────
// Admin creates quiz
router.post('/', protect, authorize('admin'), createQuiz);

// Admin sees their own quizzes
router.get('/admin', protect, authorize('admin'), getMyQuizzes);

// Admin updates a quiz
router.put('/:id', protect, authorize('admin'), updateQuiz);

// Admin deletes a quiz
router.delete('/:id', protect, authorize('admin'), deleteQuiz);

// ── STUDENT ────────────────────────────────────────────────────
// Student fetches attempt history
router.get('/history', protect, authorize('student'), getQuizHistory);

// Student sees published quizzes
router.get('/', protect, authorize('student'), getPublishedQuizzes);

// Student fetches full quiz + questions
router.get('/:id', protect, authorize('student', 'admin'), getQuizById);

// Student submits answers
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;