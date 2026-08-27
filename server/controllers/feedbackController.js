import { Feedback } from '../models/Feedback.js';
import { Notification } from '../models/Notification.js';

// @desc   Submit user feedback (bug, suggestion, query, appreciation)
// @route  POST /api/feedback
export const submitFeedback = async (req, res) => {
  try {
    const { userName, userEmail, category, subject, message, sentiment } = req.body;

    if (!userName || !userEmail || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const calculatedSentiment =
      sentiment ||
      (category === 'bug'
        ? 'urgent'
        : category === 'appreciation'
        ? 'positive'
        : 'neutral');

    const feedback = await Feedback.create({
      userId: req.user ? req.user._id : null,
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      category: category || 'suggestion',
      subject: subject || 'User Submission',
      message: message.trim(),
      sentiment: calculatedSentiment,
      status: 'open',
    });

    res.status(201).json({ feedback, message: 'Feedback submitted successfully. Thank you!' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to submit feedback' });
  }
};

// @desc   Admin: Get all feedback with sentiment analytics summary
// @route  GET /api/feedback
export const getAllFeedback = async (req, res) => {
  try {
    const { category, status, sentiment } = req.query;
    let query = {};

    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (sentiment && sentiment !== 'all') query.sentiment = sentiment;

    const items = await Feedback.find(query).sort({ createdAt: -1 });

    // Sentiment breakdown stats
    const total = await Feedback.countDocuments();
    const positiveCount = await Feedback.countDocuments({ sentiment: 'positive' });
    const urgentCount = await Feedback.countDocuments({ sentiment: 'urgent' });
    const neutralCount = await Feedback.countDocuments({ sentiment: 'neutral' });
    const openCount = await Feedback.countDocuments({ status: 'open' });
    const resolvedCount = await Feedback.countDocuments({ status: 'resolved' });

    res.json({
      items,
      stats: {
        total,
        positiveCount,
        urgentCount,
        neutralCount,
        openCount,
        resolvedCount,
        satisfactionRate: total > 0 ? Math.round((positiveCount / total) * 100) : 94,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch feedback' });
  }
};

// @desc   Admin: Respond to feedback and update status
// @route  PUT /api/feedback/:id
export const respondFeedback = async (req, res) => {
  try {
    const { adminResponse, status } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (adminResponse !== undefined) feedback.adminResponse = adminResponse;
    if (status) feedback.status = status;
    feedback.respondedAt = new Date();

    await feedback.save();

    // If feedback has associated userId, trigger in-app notification
    if (feedback.userId) {
      await Notification.create({
        userId: feedback.userId,
        title: `Feedback Response: ${feedback.subject || feedback.category}`,
        message: adminResponse || `Your feedback has been marked as ${feedback.status}.`,
        type: 'feedback_reply',
      });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update feedback' });
  }
};

// @desc   Admin: Delete feedback
// @route  DELETE /api/feedback/:id
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete feedback' });
  }
};
