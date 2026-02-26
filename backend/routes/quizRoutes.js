const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getPublishedQuizzes,
  getMyQuizzes
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin creates quiz
router.post('/', protect, authorize('admin'), createQuiz);

// Admin sees quizzes they created
router.get('/admin', protect, authorize('admin'), getMyQuizzes);

// Students (and optionally anyone authenticated) see published quizzes
// If you want this strictly for students, keep authorize('student').
// If you want admins to preview the same list, remove authorize('student').
router.get('/', protect, authorize('student'), getPublishedQuizzes);

module.exports = router;