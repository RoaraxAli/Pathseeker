const express = require('express');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const QuizAttempt = require('../models/QuizAttempt');
const Bookmark = require('../models/Bookmark');
const MediaRating = require('../models/MediaRating');
const Resource = require('../models/Resource');
const Career = require('../models/Career');
const Media = require('../models/Media');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireRole('admin'));

const DAY_MS = 24 * 60 * 60 * 1000;

// GET /api/admin/analytics/feedback
router.get('/analytics/feedback', async (req, res) => {
  try {
    const [byType, byStatus, total, recent] = await Promise.all([
      Feedback.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Feedback.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Feedback.countDocuments(),
      Feedback.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
    ]);

    const toMap = (agg) => Object.fromEntries(agg.map((a) => [a._id, a.count]));

    res.json({
      total,
      byType: toMap(byType),
      byStatus: toMap(byStatus),
      recent,
    });
  } catch (err) {
    console.error('[admin/analytics/feedback GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching feedback analytics' });
  }
});

// GET /api/admin/analytics/usage — real, derived numbers only (no fabricated stats).
router.get('/analytics/usage', async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * DAY_MS);
    const thirtyDaysAgo = new Date(now - 30 * DAY_MS);

    const [
      totalUsers,
      usersByRoleAgg,
      activeLast7,
      activeLast30,
      totalQuizAttempts,
      quizAttemptsLast7,
      totalCareers,
      totalMedia,
      totalResources,
      mostBookmarkedCareersAgg,
      mostBookmarkedMediaAgg,
      topDownloadedResources,
      mostRatedMediaAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      User.countDocuments({ lastLoginAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ lastLoginAt: { $gte: thirtyDaysAgo } }),
      QuizAttempt.countDocuments(),
      QuizAttempt.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Career.countDocuments(),
      Media.countDocuments(),
      Resource.countDocuments(),
      Bookmark.aggregate([
        { $match: { itemType: 'career' } },
        { $group: { _id: '$itemId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Bookmark.aggregate([
        { $match: { itemType: 'media' } },
        { $group: { _id: '$itemId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Resource.find().sort({ downloadCount: -1 }).limit(5).select('title downloadCount'),
      MediaRating.aggregate([
        { $group: { _id: '$media', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Resolve titles for the aggregated (id, count) results.
    const [careerDocs, mediaDocsForBookmarks, mediaDocsForRatings] = await Promise.all([
      Career.find({ _id: { $in: mostBookmarkedCareersAgg.map((a) => a._id) } }).select('title'),
      Media.find({ _id: { $in: mostBookmarkedMediaAgg.map((a) => a._id) } }).select('title'),
      Media.find({ _id: { $in: mostRatedMediaAgg.map((a) => a._id) } }).select('title'),
    ]);
    const titleOf = (docs, id) => docs.find((d) => String(d._id) === String(id))?.title || '(deleted)';

    res.json({
      users: {
        total: totalUsers,
        byRole: Object.fromEntries(usersByRoleAgg.map((r) => [r._id, r.count])),
        activeLast7Days: activeLast7,
        activeLast30Days: activeLast30,
      },
      quiz: {
        totalAttempts: totalQuizAttempts,
        attemptsLast7Days: quizAttemptsLast7,
      },
      content: {
        totalCareers,
        totalMedia,
        totalResources,
      },
      popular: {
        careers: mostBookmarkedCareersAgg.map((a) => ({
          title: titleOf(careerDocs, a._id),
          bookmarkCount: a.count,
        })),
        media: mostBookmarkedMediaAgg.map((a) => ({
          title: titleOf(mediaDocsForBookmarks, a._id),
          bookmarkCount: a.count,
        })),
        resources: topDownloadedResources.map((r) => ({
          title: r.title,
          downloadCount: r.downloadCount,
        })),
        mostRatedMedia: mostRatedMediaAgg.map((a) => ({
          title: titleOf(mediaDocsForRatings, a._id),
          ratingCount: a.count,
        })),
      },
    });
  } catch (err) {
    console.error('[admin/analytics/usage GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching usage stats' });
  }
});

module.exports = router;
