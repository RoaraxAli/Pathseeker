const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ notifications });
  } catch (err) {
    console.error('[notifications GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching notifications' });
  }
});

// GET /api/notifications/unread-count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong fetching unread count' });
  }
});

// PATCH /api/notifications/read-all — must be registered before /:id/read
// so 'read-all' isn't swallowed as an :id.
router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong updating notifications' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ notification });
  } catch (err) {
    res.status(400).json({ error: 'Invalid notification id' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid notification id' });
  }
});

module.exports = router;
