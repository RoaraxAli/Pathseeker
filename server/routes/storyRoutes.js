import express from 'express';
import {
  getStories,
  getStoryById,
  submitStory,
  likeStory,
  getAdminStories,
  updateStoryStatus,
  deleteStory,
} from '../controllers/storyController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getStories)
  .post(optionalProtect, submitStory);

router.route('/admin/all')
  .get(protect, admin, getAdminStories);

router.route('/:id')
  .get(getStoryById)
  .delete(protect, admin, deleteStory);

router.route('/:id/like')
  .post(likeStory);

router.route('/:id/status')
  .put(protect, admin, updateStoryStatus);

export default router;
