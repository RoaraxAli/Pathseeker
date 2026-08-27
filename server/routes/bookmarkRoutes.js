import express from 'express';
import {
  getUserBookmarks,
  toggleBookmark,
  updateBookmarkNotes,
  deleteBookmark,
} from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUserBookmarks)
  .post(toggleBookmark);

router.route('/:id')
  .delete(deleteBookmark);

router.route('/:id/notes')
  .put(updateBookmarkNotes);

export default router;
