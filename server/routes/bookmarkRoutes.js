const express = require('express');
const crypto = require('crypto');
const Bookmark = require('../models/Bookmark');
const BookmarkShare = require('../models/BookmarkShare');
const Career = require('../models/Career');
const Media = require('../models/Media');
const Resource = require('../models/Resource');
const SuccessStory = require('../models/SuccessStory');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const generateListPdf = require('../utils/generateListPdf');

const router = express.Router();

const MODELS_BY_TYPE = { career: Career, media: Media, resource: Resource, story: SuccessStory };

// Resolves each bookmark's referenced item to a display title (all four
// models use `title`). Items that were since deleted resolve to a
// placeholder rather than crashing.
async function withTitles(bookmarks) {
  const byType = {};
  for (const b of bookmarks) {
    (byType[b.itemType] ||= []).push(b.itemId);
  }
  const titleMaps = {};
  for (const [itemType, ids] of Object.entries(byType)) {
    const Model = MODELS_BY_TYPE[itemType];
    const docs = await Model.find({ _id: { $in: ids } }).select('title');
    titleMaps[itemType] = new Map(docs.map((d) => [String(d._id), d.title]));
  }
  return bookmarks.map((b) => ({
    _id: b._id,
    itemType: b.itemType,
    itemId: b.itemId,
    note: b.note,
    createdAt: b.createdAt,
    title: titleMaps[b.itemType]?.get(String(b.itemId)) || '(item no longer available)',
  }));
}

// GET /api/bookmarks/share/:token — PUBLIC, no auth. Must be registered
// before `router.use(protect)` below, since that only gates routes
// registered after it.
router.get('/share/:token', async (req, res) => {
  try {
    const share = await BookmarkShare.findOne({ token: req.params.token });
    if (!share) return res.status(404).json({ error: 'Share link not found or expired' });
    res.json({
      createdAt: share.createdAt,
      items: share.items,
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid share link' });
  }
});

router.use(protect);

// GET /api/bookmarks
router.get('/', async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.query.itemType) query.itemType = req.query.itemType;
    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    res.json({ bookmarks: await withTitles(bookmarks) });
  } catch (err) {
    console.error('[bookmarks GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching bookmarks' });
  }
});

// POST /api/bookmarks — body: { itemType, itemId, note? }. Upserts: bookmarking
// something already bookmarked just updates the note instead of erroring.
router.post('/', async (req, res) => {
  try {
    const { itemType, itemId, note } = req.body;
    const Model = MODELS_BY_TYPE[itemType];
    if (!Model) {
      return res.status(400).json({ error: `itemType must be one of: ${Object.keys(MODELS_BY_TYPE).join(', ')}` });
    }
    const exists = await Model.exists({ _id: itemId });
    if (!exists) return res.status(404).json({ error: `No ${itemType} found with that id` });

    const bookmark = await Bookmark.findOneAndUpdate(
      { user: req.user._id, itemType, itemId },
      { $set: { note: note || '' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ bookmark });
  } catch (err) {
    console.error('[bookmarks POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not create bookmark' });
  }
});

// PUT /api/bookmarks/:id — update the note. Owner-only.
router.put('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { note: req.body.note || '' } },
      { new: true }
    );
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ bookmark });
  } catch (err) {
    res.status(400).json({ error: 'Invalid bookmark id' });
  }
});

// DELETE /api/bookmarks/:id — owner-only.
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid bookmark id' });
  }
});

// GET /api/bookmarks/export/pdf — generates the PDF on the fly, no disk write.
router.get('/export/pdf', async (req, res) => {
  try {
    const bookmarks = await withTitles(await Bookmark.find({ user: req.user._id }).sort({ itemType: 1 }));
    const lines = bookmarks.map(
      (b) => `[${b.itemType}] ${b.title}${b.note ? ' — Note: ' + b.note : ''}`
    );
    const pdf = generateListPdf(`${req.user.name}'s Bookmarks`, lines);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="bookmarks.pdf"');
    res.send(pdf);
  } catch (err) {
    console.error('[bookmarks/export/pdf GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong exporting your bookmarks' });
  }
});

// POST /api/bookmarks/export/email — emails the bookmark list (defaults to
// the caller's own account email; falls back to console logging like the
// Phase 1 OTP flow if EMAIL_USER/EMAIL_PASS aren't configured).
router.post('/export/email', async (req, res) => {
  try {
    const bookmarks = await withTitles(await Bookmark.find({ user: req.user._id }).sort({ itemType: 1 }));
    const to = req.body.toEmail || req.user.email;
    const listHtml = bookmarks
      .map((b) => `<li><strong>[${b.itemType}]</strong> ${b.title}${b.note ? ` — <em>${b.note}</em>` : ''}</li>`)
      .join('');

    await sendEmail({
      to,
      subject: 'Your PathSeeker Bookmarks',
      html: `<h2>Your Bookmarks</h2><ul>${listHtml || '<li>No bookmarks yet</li>'}</ul>`,
      text: bookmarks.map((b) => `[${b.itemType}] ${b.title}${b.note ? ' - ' + b.note : ''}`).join('\n'),
    });

    res.json({ message: `Bookmarks sent to ${to}` });
  } catch (err) {
    console.error('[bookmarks/export/email POST] error:', err.message);
    res.status(500).json({ error: 'Something went wrong emailing your bookmarks' });
  }
});

// POST /api/bookmarks/share — creates a public, read-only snapshot link.
router.post('/share', async (req, res) => {
  try {
    const bookmarks = await withTitles(await Bookmark.find({ user: req.user._id }));
    const token = crypto.randomBytes(16).toString('hex');
    const share = await BookmarkShare.create({
      owner: req.user._id,
      token,
      items: bookmarks.map((b) => ({ itemType: b.itemType, title: b.title, note: b.note })),
    });
    res.status(201).json({ token: share.token });
  } catch (err) {
    console.error('[bookmarks/share POST] error:', err.message);
    res.status(500).json({ error: 'Something went wrong creating a share link' });
  }
});

module.exports = router;
