require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Ping = require('./models/Ping');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const careerRoutes = require('./routes/careerRoutes');
const savedSearchRoutes = require('./routes/savedSearchRoutes');
const quizRoutes = require('./routes/quizRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Uploaded media files (video/audio) are meant to be publicly playable,
// unlike resumes which require an authenticated download route.
app.use('/uploads/media', express.static(path.join(__dirname, 'uploads', 'media')));
// Resource files (PDFs/checklists) are served two ways: this static mount
// is used for the "preview" popup (inline, uncounted), while
// /api/resources/:id/download is the tracked, forced-download path.
app.use('/uploads/resources', express.static(path.join(__dirname, 'uploads', 'resources')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/saved-searches', savedSearchRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Simple liveness check — no DB involved.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// End-to-end test route: writes a Ping doc to MongoDB and reads back the
// total count, proving Express <-> MongoDB <-> React all work together.
app.get('/api/ping', async (req, res) => {
  try {
    await Ping.create({});
    const count = await Ping.countDocuments();
    res.json({
      message: 'pong from the server',
      pings: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[api/ping] error:', err.message);
    res.status(500).json({ error: 'Something went wrong talking to the database' });
  }
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] Listening on http://localhost:${PORT}`);
  });
}

start();
