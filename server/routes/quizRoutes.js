import express from 'express';
import {
  getQuizQuestions,
  submitQuiz,
  getQuizHistory,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
} from '../controllers/quizController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/questions')
  .get(getQuizQuestions)
  .post(protect, admin, createQuizQuestion);

router.route('/questions/:id')
  .put(protect, admin, updateQuizQuestion)
  .delete(protect, admin, deleteQuizQuestion);

router.route('/submit')
  .post(optionalProtect, submitQuiz);

router.route('/history')
  .get(protect, getQuizHistory);

export default router;
