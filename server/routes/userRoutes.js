const express = require('express');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');
const { uploadResume, UPLOAD_DIR } = require('../middleware/upload');
const serializeUser = require('../utils/serializeUser');

const router = express.Router();

// Fields a user is allowed to edit about their own profile. Deliberately
// excludes name/email/password/role/resume — those go through dedicated,
// more careful endpoints.
const EDITABLE_FIELDS = ['education', 'skills', 'interests', 'workExperience'];

router.use(protect);

// GET /api/users/me — full profile for the logged-in user.
router.get('/me', (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

// PUT /api/users/me — update profile fields (education, skills, interests, workExperience).
router.put('/me', async (req, res) => {
  try {
    const updates = {};

    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] === undefined) continue;

      if (field === 'skills' || field === 'interests') {
        if (!Array.isArray(req.body[field]) || !req.body[field].every((v) => typeof v === 'string')) {
          return res.status(400).json({ error: `${field} must be an array of strings` });
        }
      } else if (!Array.isArray(req.body[field])) {
        return res.status(400).json({ error: `${field} must be an array` });
      }

      updates[field] = req.body[field];
    }

    Object.assign(req.user, updates);
    await req.user.save();

    res.json({ user: serializeUser(req.user) });
  } catch (err) {
    console.error('[users/me PUT] error:', err.message);
    res.status(500).json({ error: 'Something went wrong updating the profile' });
  }
});

// POST /api/users/me/resume — upload/replace the resume file.
router.post('/me/resume', uploadResume.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file was provided' });
    }

    // Remove the previous file, if any, before pointing to the new one.
    const previous = req.user.resume?.filename;
    if (previous) {
      fs.unlink(path.join(UPLOAD_DIR, previous), () => {});
    }

    req.user.resume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };
    await req.user.save();

    res.status(201).json({ user: serializeUser(req.user) });
  } catch (err) {
    console.error('[users/me/resume POST] error:', err.message);
    res.status(500).json({ error: 'Something went wrong uploading the resume' });
  }
});

// GET /api/users/me/resume — download the current resume.
router.get('/me/resume', async (req, res) => {
  const resume = req.user.resume;
  if (!resume?.filename) {
    return res.status(404).json({ error: 'No resume uploaded yet' });
  }

  const filePath = path.join(UPLOAD_DIR, resume.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Resume file is missing on the server' });
  }

  res.download(filePath, resume.originalName || resume.filename);
});

// DELETE /api/users/me/resume — remove the resume.
router.delete('/me/resume', async (req, res) => {
  try {
    const resume = req.user.resume;
    if (!resume?.filename) {
      return res.status(404).json({ error: 'No resume to delete' });
    }

    fs.unlink(path.join(UPLOAD_DIR, resume.filename), () => {});
    req.user.resume = undefined;
    await req.user.save();

    res.json({ user: serializeUser(req.user) });
  } catch (err) {
    console.error('[users/me/resume DELETE] error:', err.message);
    res.status(500).json({ error: 'Something went wrong deleting the resume' });
  }
});

// Multer errors (bad file type, too large) land here instead of the generic
// Express error handler, so we can respond with a clean 400 instead of a 500.
router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
  next();
});

module.exports = router;
