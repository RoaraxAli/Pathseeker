const express = require('express');
const Feedback = require('../models/Feedback');
const { protect, optionalAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback — public; if logged in, the submission is tied to the
// account automatically, but anonymous submissions (with a contact email)
// are also allowed.
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { type, message, email } = req.body;
    if (!['bug', 'suggestion', 'query'].includes(type)) {
      return res.status(400).json({ error: 'type must be bug, suggestion, or query' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (!req.user && !email) {
      return res.status(400).json({ error: 'email is required for anonymous feedback' });
    }

    const feedback = await Feedback.create({
      user: req.user?._id,
      email: email || req.user?.email,
      type,
      message: message.trim(),
    });
    res.status(201).json({ feedback });
  } catch (err) {
    console.error('[feedback POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not submit feedback' });
  }
});

// GET /api/feedback — admin only.
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    const items = await Feedback.find(query).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json({ feedback: items });
  } catch (err) {
    console.error('[feedback GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching feedback' });
  }
});

// PATCH /api/feedback/:id — admin only, update status.
router.patch('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    if (!['open', 'reviewed', 'resolved'].includes(req.body.status)) {
      return res.status(400).json({ error: 'status must be open, reviewed, or resolved' });
    }
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ feedback });
  } catch (err) {
    res.status(400).json({ error: 'Invalid feedback id' });
  }
});

module.exports = router;
