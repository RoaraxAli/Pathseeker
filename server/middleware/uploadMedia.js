const fs = require('fs');
const path = require('path');
const multer = require('multer');

const os = require('os');

const UPLOAD_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads', 'media')
  : path.join(__dirname, '..', 'uploads', 'media');

try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (err) {
  // Read-only filesystem in serverless environments
}

const ALLOWED_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const uploadMediaFile = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('Only MP4/WebM video or MP3/WAV audio files are allowed'));
    }
    cb(null, true);
  },
});

module.exports = { uploadMediaFile, UPLOAD_DIR };
