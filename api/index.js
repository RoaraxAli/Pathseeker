import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from '../server/routes/authRoutes.js';
import careerRoutes from '../server/routes/careerRoutes.js';
import multimediaRoutes from '../server/routes/multimediaRoutes.js';
import quizRoutes from '../server/routes/quizRoutes.js';
import storyRoutes from '../server/routes/storyRoutes.js';
import resourceRoutes from '../server/routes/resourceRoutes.js';
import feedbackRoutes from '../server/routes/feedbackRoutes.js';
import bookmarkRoutes from '../server/routes/bookmarkRoutes.js';
import notificationRoutes from '../server/routes/notificationRoutes.js';
import adminStatsRoutes from '../server/routes/adminStatsRoutes.js';
import { seedDatabase } from '../server/utils/seedData.js';

import { notFound, errorHandler } from '../server/middleware/errorMiddleware.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isConnected = false;
let isSeeded = false;

const connectToDatabase = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techwiz';

  const db = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  isConnected = db.connections[0].readyState === 1;

  if (!isSeeded) {
    seedDatabase().catch((err) => console.error('Seed error:', err.message));
    isSeeded = true;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Serverless DB connection error:', err);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Vercel Serverless',
    service: 'PathSeeker API',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/multimedia', multimediaRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/stats', adminStatsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
