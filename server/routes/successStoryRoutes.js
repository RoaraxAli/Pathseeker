const express = require('express');
const SuccessStory = require('../models/SuccessStory');
const { protect, optionalAuth, requireRole } = require('../middleware/auth');
const notify = require('../utils/notify');

const router = express.Router();

function serialize(story) {
  return {
    _id: story._id,
    title: story.title,
    authorName: story.authorName,
    content: story.content,
    domain: story.domain,
    tags: story.tags,
    storyDate: story.storyDate,
    imageUrl: story.imageUrl,
    status: story.status,
    createdAt: story.createdAt,
  };
}

// GET /api/success-stories — public, approved stories only. Filters + sort
// for either card view (newest first) or timeline view (chronological).
router.get('/', async (req, res) => {
  try {
    const { domain, tag, q, sort } = req.query;
    const query = { status: 'approved' };
    if (domain) query.domain = domain;
    if (tag) query.tags = tag;
    if (q) query.title = new RegExp(q, 'i');

    const sortOrder = sort === 'timeline' ? { storyDate: 1 } : { storyDate: -1 };
    const stories = await SuccessStory.find(query).sort(sortOrder);
    res.json({ stories: stories.map(serialize) });
  } catch (err) {
    console.error('[success-stories GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching stories' });
  }
});

// GET /api/success-stories/meta
router.get('/meta', async (req, res) => {
  try {
    const [domains, tags] = await Promise.all([
      SuccessStory.distinct('domain', { status: 'approved' }),
      SuccessStory.distinct('tags', { status: 'approved' }),
    ]);
    res.json({ domains: domains.filter(Boolean).sort(), tags: tags.filter(Boolean).sort() });
  } catch (err) {
    console.error('[success-stories/meta GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching filter options' });
  }
});

// GET /api/success-stories/mine — protected: the current user's own submissions, any status.
router.get('/mine', protect, async (req, res) => {
  try {
    const stories = await SuccessStory.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ stories: stories.map(serialize) });
  } catch (err) {
    console.error('[success-stories/mine GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching your stories' });
  }
});

// GET /api/success-stories/pending — admin only: the review queue.
router.get('/pending', protect, requireRole('admin'), async (req, res) => {
  try {
    const stories = await SuccessStory.find({ status: 'pending' }).sort({ createdAt: 1 });
    res.json({ stories: stories.map(serialize) });
  } catch (err) {
    console.error('[success-stories/pending GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching the review queue' });
  }
});

// GET /api/success-stories/admin/all — admin only: every story regardless of status.
router.get('/admin/all', protect, requireRole('admin'), async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.json({ stories: stories.map(serialize) });
  } catch (err) {
    console.error('[success-stories/admin/all GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching stories' });
  }
});

// GET /api/success-stories/:id — public if approved; otherwise only the
// submitter or an admin may view it (so authors can preview their own
// pending/rejected submission without exposing it publicly).
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });

    const isOwner = req.user && String(story.submittedBy) === String(req.user._id);
    const isAdmin = req.user?.role === 'admin';
    if (story.status !== 'approved' && !isOwner && !isAdmin) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({ story: serialize(story) });
  } catch (err) {
    res.status(400).json({ error: 'Invalid story id' });
  }
});

// POST /api/success-stories — protected: any logged-in user can submit; starts as 'pending'.
router.post('/', protect, async (req, res) => {
  try {
    const { title, authorName, content, domain, tags, storyDate, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }

    const story = await SuccessStory.create({
      title,
      authorName: authorName || req.user.name,
      content,
      domain,
      tags: Array.isArray(tags) ? tags : [],
      storyDate: storyDate || Date.now(),
      imageUrl,
      status: 'pending',
      submittedBy: req.user._id,
    });

    res.status(201).json({ story: serialize(story) });
  } catch (err) {
    console.error('[success-stories POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not submit story' });
  }
});

// PUT /api/success-stories/:id — admin only: edit content directly
// (distinct from /:id/review, which only changes approval status).
router.put('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const { title, authorName, content, domain, tags, storyDate, imageUrl } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (authorName !== undefined) updates.authorName = authorName;
    if (content !== undefined) updates.content = content;
    if (domain !== undefined) updates.domain = domain;
    if (tags !== undefined) updates.tags = tags;
    if (storyDate !== undefined) updates.storyDate = storyDate;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const story = await SuccessStory.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json({ story: serialize(story) });
  } catch (err) {
    console.error('[success-stories/:id PUT] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not update story' });
  }
});

// PUT /api/success-stories/:id/review — admin only: approve or reject.
router.put('/:id/review', protect, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "status must be 'approved' or 'rejected'" });
    }

    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!story) return res.status(404).json({ error: 'Story not found' });

    await notify(
      story.submittedBy,
      status === 'approved' ? 'story_approved' : 'story_rejected',
      status === 'approved'
        ? `Your story "${story.title}" was approved and is now live!`
        : `Your story "${story.title}" was not approved.`,
      status === 'approved' ? '/success-stories' : undefined
    );

    res.json({ story: serialize(story) });
  } catch (err) {
    console.error('[success-stories/:id/review PUT] error:', err.message);
    res.status(400).json({ error: 'Invalid story id' });
  }
});

// DELETE /api/success-stories/:id — admin only.
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid story id' });
  }
});

module.exports = router;
