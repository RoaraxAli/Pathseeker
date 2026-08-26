const fs = require('fs');
const path = require('path');
const multer = require('multer');

const os = require('os');

const UPLOAD_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads', 'resumes')
  : path.join(__dirname, '..', 'uploads', 'resumes');

try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (err) {
  // Read-only filesystem in serverless environments
}

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${req.user._id}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('Only PDF, DOC, or DOCX files are allowed'));
    }
    cb(null, true);
  },
});

module.exports = { uploadResume, UPLOAD_DIR };
