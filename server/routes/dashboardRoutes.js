const express = require('express');
const Bookmark = require('../models/Bookmark');
const QuizAttempt = require('../models/QuizAttempt');
const SuccessStory = require('../models/SuccessStory');
const Career = require('../models/Career');
const Media = require('../models/Media');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

const DAY_MS = 24 * 60 * 60 * 1000;

// Builds recommendations in priority order: most recent quiz result's top
// categories > profile skills/interests > fallback to high-demand careers.
// Never recommends something the user already bookmarked.
async function buildRecommendations(user, alreadyBookmarkedCareerIds) {
  const exclude = { _id: { $nin: alreadyBookmarkedCareerIds } };

  const latestAttempt = await QuizAttempt.findOne({ user: user._id }).sort({ createdAt: -1 });
  if (latestAttempt?.topCategories?.length) {
    const byQuiz = await Career.find({ domain: { $in: latestAttempt.topCategories }, ...exclude })
      .sort({ jobDemand: -1, title: 1 })
      .limit(6);
    if (byQuiz.length) return { source: 'quiz', careers: byQuiz };
  }

  const skillsAndInterests = [...(user.skills || []), ...(user.interests || [])];
  if (skillsAndInterests.length) {
    const patterns = skillsAndInterests.map((s) => new RegExp(`^${s}$`, 'i'));
    const bySkills = await Career.find({ requiredSkills: { $in: patterns }, ...exclude })
      .sort({ jobDemand: -1, title: 1 })
      .limit(6);
    if (bySkills.length) return { source: 'profile', careers: bySkills };
  }

  const fallback = await Career.find({ jobDemand: 'high', ...exclude }).sort({ title: 1 }).limit(6);
  return { source: 'fallback', careers: fallback };
}

// GET /api/dashboard/summary — everything the dashboard needs, one call.
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user._id;

    const [recentBookmarks, recentAttempts, recentStories, latestAttempt] = await Promise.all([
      Bookmark.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      QuizAttempt.find({ user: userId }).sort({ createdAt: -1 }).limit(3),
      SuccessStory.find({ submittedBy: userId }).sort({ createdAt: -1 }).limit(3),
      QuizAttempt.findOne({ user: userId }).sort({ createdAt: -1 }).populate('suggestedCareers'),
    ]);

    // Resolve bookmark titles (same approach as bookmarkRoutes' withTitles).
    const modelsByType = { career: Career, media: Media, resource: Resource, story: SuccessStory };
    const byType = {};
    for (const b of recentBookmarks) (byType[b.itemType] ||= []).push(b.itemId);
    const titleMaps = {};
    for (const [itemType, ids] of Object.entries(byType)) {
      const docs = await modelsByType[itemType].find({ _id: { $in: ids } }).select('title');
      titleMaps[itemType] = new Map(docs.map((d) => [String(d._id), d.title]));
    }

    const activity = [
      ...recentBookmarks.map((b) => ({
        type: 'bookmark',
        message: `Bookmarked "${titleMaps[b.itemType]?.get(String(b.itemId)) || '(item removed)'}"`,
        date: b.createdAt,
        link: b.itemType === 'career' ? '/careers' : b.itemType === 'media' ? `/media/${b.itemId}` : '/resources',
      })),
      ...recentAttempts.map((a) => ({
        type: 'quiz',
        message: `Took the Interest Quiz — top match: ${a.topCategories[0] || 'N/A'}`,
        date: a.createdAt,
        link: '/quiz/history',
      })),
      ...recentStories.map((s) => ({
        type: 'story',
        message: `Submitted story "${s.title}" (${s.status})`,
        date: s.createdAt,
        link: '/success-stories',
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const bookmarkedCareerIds = await Bookmark.find({ user: userId, itemType: 'career' }).distinct('itemId');
    const { source, careers: recommendations } = await buildRecommendations(req.user, bookmarkedCareerIds);

    const thirtyDaysAgo = new Date(Date.now() - 30 * DAY_MS);
    const trendingAgg = await Bookmark.aggregate([
      { $match: { itemType: 'career', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$itemId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const trendingCareerDocs = await Career.find({ _id: { $in: trendingAgg.map((t) => t._id) } });
    const trendingCareers = trendingAgg
      .map((t) => {
        const career = trendingCareerDocs.find((c) => String(c._id) === String(t._id));
        return career ? { _id: career._id, title: career.title, domain: career.domain, bookmarkCount: t.count } : null;
      })
      .filter(Boolean);

    res.json({
      recentActivity: activity,
      latestQuizResult: latestAttempt
        ? {
            scores: latestAttempt.scores,
            topCategories: latestAttempt.topCategories,
            suggestedCareers: latestAttempt.suggestedCareers,
            createdAt: latestAttempt.createdAt,
          }
        : null,
      savedItems: recentBookmarks.map((b) => ({
        _id: b._id,
        itemType: b.itemType,
        title: titleMaps[b.itemType]?.get(String(b.itemId)) || '(item removed)',
      })),
      recommendations: { source, careers: recommendations },
      trendingCareers,
    });
  } catch (err) {
    console.error('[dashboard/summary GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong loading your dashboard' });
  }
});

module.exports = router;
