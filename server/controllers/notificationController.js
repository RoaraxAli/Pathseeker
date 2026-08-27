import { Notification } from '../models/Notification.js';

// @desc   Get user in-app notifications
// @route  GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const notifications = await Notification.find({
      $or: [{ userId }, { userId: null }],
    }).sort({ createdAt: -1 }).limit(20);

    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch notifications' });
  }
};

// @desc   Mark notification as read
// @route  PUT /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to mark notification read' });
  }
};

// @desc   Mark all notifications as read
// @route  PUT /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    await Notification.updateMany({ $or: [{ userId }, { userId: null }] }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to mark all notifications read' });
  }
};

// @desc   Admin: Broadcast notification
// @route  POST /api/notifications/broadcast
export const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type, link } = req.body;
    const notif = await Notification.create({
      userId: null,
      title,
      message,
      type: type || 'announcement',
      link: link || '',
    });
    res.status(201).json(notif);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to broadcast notification' });
  }
};
