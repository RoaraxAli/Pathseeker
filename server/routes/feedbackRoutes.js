import express from 'express';
import {
  submitFeedback,
  getAllFeedback,
  respondFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalProtect, submitFeedback)
  .get(protect, admin, getAllFeedback);

router.route('/:id')
  .put(protect, admin, respondFeedback)
  .delete(protect, admin, deleteFeedback);

export default router;
