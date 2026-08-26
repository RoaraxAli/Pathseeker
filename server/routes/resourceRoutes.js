const express = require('express');
const fs = require('fs');
const path = require('path');
const Resource = require('../models/Resource');
const { protect, requireRole } = require('../middleware/auth');
const { uploadResourceFile, UPLOAD_DIR } = require('../middleware/uploadResource');

const router = express.Router();

function previewUrl(resource) {
  // Preview is a plain static link — opening it (e.g. in an <iframe>) does
  // NOT count as a download. Only /download does that.
  return resource.sourceType === 'upload' ? `/uploads/resources/${resource.file.filename}` : resource.externalUrl;
}

// GET /api/resources — public library browsing, like the Career Bank.
router.get('/', async (req, res) => {
  try {
    const { type, domain, tag, q } = req.query;
    const query = {};
    if (type) query.type = type;
    if (domain) query.domain = domain;
    if (tag) query.tags = tag;
    if (q) query.title = new RegExp(q, 'i');

    const items = await Resource.find(query).sort({ createdAt: -1 });
    res.json({
      resources: items.map((r) => ({
        _id: r._id,
        title: r.title,
        description: r.description,
        type: r.type,
        domain: r.domain,
        tags: r.tags,
        sourceType: r.sourceType,
        downloadCount: r.downloadCount,
        previewUrl: previewUrl(r),
      })),
    });
  } catch (err) {
    console.error('[resources GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching resources' });
  }
});

// GET /api/resources/meta
router.get('/meta', async (req, res) => {
  try {
    const [domains, tags] = await Promise.all([Resource.distinct('domain'), Resource.distinct('tags')]);
    res.json({
      domains: domains.filter(Boolean).sort(),
      tags: tags.filter(Boolean).sort(),
      types: ['pdf', 'checklist', 'template', 'guide'],
    });
  } catch (err) {
    console.error('[resources/meta GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching filter options' });
  }
});

// GET /api/resources/:id
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({
      resource: {
        _id: resource._id,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        domain: resource.domain,
        tags: resource.tags,
        sourceType: resource.sourceType,
        downloadCount: resource.downloadCount,
        previewUrl: previewUrl(resource),
      },
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid resource id' });
  }
});

// GET /api/resources/:id/download — public, but tracked: increments the
// counter and, for uploads, forces a real download (Content-Disposition:
// attachment) rather than the inline view that preview uses.
router.get('/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    if (resource.sourceType === 'external') {
      // We can count the click-through, but not whether the external host
      // actually completed serving the file — an inherent limit of tracking
      // downloads for content we don't host ourselves.
      return res.redirect(resource.externalUrl);
    }

    const filePath = path.join(UPLOAD_DIR, resource.file.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File is missing on the server' });
    }
    res.download(filePath, resource.file.originalName || resource.file.filename);
  } catch (err) {
    console.error('[resources/:id/download GET] error:', err.message);
    res.status(400).json({ error: 'Invalid resource id' });
  }
});

// POST /api/resources — admin only.
router.post('/', protect, requireRole('admin'), uploadResourceFile.single('file'), async (req, res) => {
  try {
    const body = req.body;
    const sourceType = req.file ? 'upload' : 'external';
    if (sourceType === 'external' && !body.externalUrl) {
      return res.status(400).json({ error: 'externalUrl is required when not uploading a file' });
    }

    const resource = await Resource.create({
      title: body.title,
      description: body.description,
      type: body.type || 'pdf',
      domain: body.domain,
      tags: body.tags ? String(body.tags).split(',').map((t) => t.trim()).filter(Boolean) : [],
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
      createdBy: req.user._id,
    });

    res.status(201).json({ resource });
  } catch (err) {
    console.error('[resources POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not create resource' });
  }
});

// DELETE /api/resources/:id — admin only.
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    if (resource.file?.filename) {
      fs.unlink(path.join(UPLOAD_DIR, resource.file.filename), () => {});
    }
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid resource id' });
  }
});

router.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
  next();
});

module.exports = router;
