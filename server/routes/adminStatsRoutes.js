import express from 'express';
import { getAdminStats, triggerSeed } from '../controllers/adminStatsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getAdminStats);

router.route('/seed')
  .post(protect, admin, triggerSeed);

export default router;
