import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import multimediaRoutes from './routes/multimediaRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminStatsRoutes from './routes/adminStatsRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
dotenv.config({ path: '../.env' });

// Connect to MongoDB & Seed initial dataset
connectDB().then(() => {
  seedDatabase();
});

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'PathSeeker Career Passport REST API',
    theme: 'Career Passport',
    competition: 'Aptech TechWiz 6',
  });
});

// Mount Routes
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

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PathSeeker Server running on port ${PORT} [http://localhost:${PORT}]`);
});
