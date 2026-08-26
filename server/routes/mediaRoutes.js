const express = require('express');
const fs = require('fs');
const path = require('path');
const Media = require('../models/Media');
const MediaRating = require('../models/MediaRating');
const { protect, optionalAuth, requireRole } = require('../middleware/auth');
const { uploadMediaFile, UPLOAD_DIR } = require('../middleware/uploadMedia');
const aggregateRating = require('../utils/aggregateRating');

const router = express.Router();

function mediaUrl(media) {
  return media.sourceType === 'upload' ? `/uploads/media/${media.file.filename}` : media.externalUrl;
}

// GET /api/media — public browsing, like the Career Bank.
router.get('/', async (req, res) => {
  try {
    const { type, domain, tag, q } = req.query;
    const query = {};
    if (type) query.type = type;
    if (domain) query.domain = domain;
    if (tag) query.tags = tag;
    if (q) query.title = new RegExp(q, 'i');

    const items = await Media.find(query).sort({ createdAt: -1 });
    const results = items.map((m) => ({
      _id: m._id,
      title: m.title,
      type: m.type,
      domain: m.domain,
      tags: m.tags,
      description: m.description,
      thumbnailUrl: m.thumbnailUrl,
      durationSeconds: m.durationSeconds,
      ratingType: m.ratingType,
      url: mediaUrl(m),
    }));
    res.json({ media: results });
  } catch (err) {
    console.error('[media GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching media' });
  }
});

// GET /api/media/meta — filter options for the UI.
router.get('/meta', async (req, res) => {
  try {
    const [domains, tags] = await Promise.all([Media.distinct('domain'), Media.distinct('tags')]);
    res.json({
      domains: domains.filter(Boolean).sort(),
      tags: tags.filter(Boolean).sort(),
      types: ['video', 'podcast', 'explainer'],
    });
  } catch (err) {
    console.error('[media/meta GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching filter options' });
  }
});

// GET /api/media/:id — detail + transcript + rating summary + related content.
// Public, but attaches the caller's own rating if they're logged in.
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    const [rating, myRating, related] = await Promise.all([
      aggregateRating(media._id, media.ratingType),
      req.user ? MediaRating.findOne({ media: media._id, user: req.user._id }) : null,
      Media.find({
        _id: { $ne: media._id },
        $or: [
          ...(media.domain ? [{ domain: media.domain }] : []),
          ...(media.tags.length ? [{ tags: { $in: media.tags } }] : []),
        ],
      }).limit(4),
    ]);

    res.json({
      media: {
        _id: media._id,
        title: media.title,
        type: media.type,
        domain: media.domain,
        tags: media.tags,
        description: media.description,
        transcript: media.transcript,
        thumbnailUrl: media.thumbnailUrl,
        durationSeconds: media.durationSeconds,
        ratingType: media.ratingType,
        url: mediaUrl(media),
      },
      rating,
      myRating: myRating ? { stars: myRating.stars, thumbs: myRating.thumbs } : null,
      related: related.map((m) => ({
        _id: m._id,
        title: m.title,
        type: m.type,
        domain: m.domain,
        thumbnailUrl: m.thumbnailUrl,
      })),
    });
  } catch (err) {
    console.error('[media/:id GET] error:', err.message);
    res.status(400).json({ error: 'Invalid media id' });
  }
});

// POST /api/media/:id/rating — protected, upsert the caller's rating.
router.post('/:id/rating', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    const update = {};
    if (media.ratingType === 'stars') {
      const stars = Number(req.body.stars);
      if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
        return res.status(400).json({ error: 'stars must be an integer from 1 to 5' });
      }
      update.stars = stars;
      update.thumbs = undefined;
    } else {
      if (!['up', 'down'].includes(req.body.thumbs)) {
        return res.status(400).json({ error: "thumbs must be 'up' or 'down'" });
      }
      update.thumbs = req.body.thumbs;
      update.stars = undefined;
    }

    const rating = await MediaRating.findOneAndUpdate(
      { media: media._id, user: req.user._id },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const summary = await aggregateRating(media._id, media.ratingType);
    res.json({ myRating: { stars: rating.stars, thumbs: rating.thumbs }, rating: summary });
  } catch (err) {
    console.error('[media/:id/rating POST] error:', err.message);
    res.status(500).json({ error: 'Something went wrong submitting the rating' });
  }
});

// DELETE /api/media/:id/rating — protected, remove the caller's own rating.
router.delete('/:id/rating', protect, async (req, res) => {
  try {
    await MediaRating.deleteOne({ media: req.params.id, user: req.user._id });
    const media = await Media.findById(req.params.id);
    const summary = media ? await aggregateRating(media._id, media.ratingType) : null;
    res.json({ message: 'Rating removed', rating: summary });
  } catch (err) {
    res.status(400).json({ error: 'Invalid media id' });
  }
});

// POST /api/media — admin only. Either JSON with externalUrl, or multipart with a 'media' file field.
router.post('/', protect, requireRole('admin'), uploadMediaFile.single('media'), async (req, res) => {
  try {
    const body = req.body;
    const sourceType = req.file ? 'upload' : 'external';

    if (sourceType === 'external' && !body.externalUrl) {
      return res.status(400).json({ error: 'externalUrl is required when not uploading a file' });
    }

    const media = await Media.create({
      title: body.title,
      type: body.type,
      domain: body.domain,
      tags: body.tags ? String(body.tags).split(',').map((t) => t.trim()).filter(Boolean) : [],
      description: body.description,
      sourceType,
      externalUrl: sourceType === 'external' ? body.externalUrl : undefined,
      file: req.file
        ? {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
          }
        : undefined,
      thumbnailUrl: body.thumbnailUrl,
      transcript: body.transcript,
      durationSeconds: body.durationSeconds ? Number(body.durationSeconds) : undefined,
      ratingType: body.ratingType || 'stars',
      createdBy: req.user._id,
    });

    res.status(201).json({ media });
  } catch (err) {
    console.error('[media POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not create media' });
  }
});

// PUT /api/media/:id — admin only. Edits metadata; optionally replaces the
// file (old file is deleted) or switches to an externalUrl.
router.put('/:id', protect, requireRole('admin'), uploadMediaFile.single('media'), async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    const body = req.body;
    if (body.title !== undefined) media.title = body.title;
    if (body.type !== undefined) media.type = body.type;
    if (body.domain !== undefined) media.domain = body.domain;
    if (body.description !== undefined) media.description = body.description;
    if (body.thumbnailUrl !== undefined) media.thumbnailUrl = body.thumbnailUrl;
    if (body.transcript !== undefined) media.transcript = body.transcript;
    if (body.ratingType !== undefined) media.ratingType = body.ratingType;
    if (body.durationSeconds !== undefined) media.durationSeconds = Number(body.durationSeconds);
    if (body.tags !== undefined) {
      media.tags = String(body.tags).split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (req.file) {
      if (media.file?.filename) fs.unlink(path.join(UPLOAD_DIR, media.file.filename), () => {});
      media.sourceType = 'upload';
      media.externalUrl = undefined;
      media.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };
    } else if (body.externalUrl) {
      if (media.file?.filename) fs.unlink(path.join(UPLOAD_DIR, media.file.filename), () => {});
      media.sourceType = 'external';
      media.externalUrl = body.externalUrl;
      media.file = undefined;
    }

    await media.save();
    res.json({ media });
  } catch (err) {
    console.error('[media/:id PUT] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not update media' });
  }
});

// DELETE /api/media/:id — admin only. Also removes the uploaded file + ratings.
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    if (media.file?.filename) {
      fs.unlink(path.join(UPLOAD_DIR, media.file.filename), () => {});
    }
    await MediaRating.deleteMany({ media: media._id });

    res.json({ message: 'Media deleted' });
  } catch (err) {
    console.error('[media DELETE] error:', err.message);
    res.status(400).json({ error: 'Invalid media id' });
  }
});

// Multer errors (bad file type, too large) land here as a clean 400.
router.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
  next();
});

module.exports = router;
