import express from 'express';
import {
  getResources,
  downloadResource,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getResources)
  .post(protect, admin, createResource);

router.route('/:id')
  .put(protect, admin, updateResource)
  .delete(protect, admin, deleteResource);

router.route('/:id/download')
  .post(downloadResource);

export default router;
