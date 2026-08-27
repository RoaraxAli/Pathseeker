import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
  broadcastNotification,
} from '../controllers/notificationController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(optionalProtect, getNotifications);

router.route('/read-all')
  .put(optionalProtect, markAllRead);

router.route('/:id/read')
  .put(optionalProtect, markNotificationRead);

router.route('/broadcast')
  .post(protect, admin, broadcastNotification);

export default router;
