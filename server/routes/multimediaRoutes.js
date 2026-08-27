import express from 'express';
import {
  getMultimedia,
  getMultimediaById,
  rateMultimedia,
  createMultimedia,
  updateMultimedia,
  deleteMultimedia,
} from '../controllers/multimediaController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMultimedia)
  .post(protect, admin, createMultimedia);

router.route('/:id')
  .get(getMultimediaById)
  .put(protect, admin, updateMultimedia)
  .delete(protect, admin, deleteMultimedia);

router.route('/:id/rate')
  .post(optionalProtect, rateMultimedia);

export default router;
