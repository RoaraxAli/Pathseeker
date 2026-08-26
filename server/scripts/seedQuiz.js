// Populates the interest quiz question bank.
// Categories match Career.domain values exactly so results plug directly
// into the Career Bank (see utils/scoreQuiz.js and routes/quizRoutes.js).
// Usage: npm run seed:quiz

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db');
const QuizQuestion = require('../models/QuizQuestion');

const questions = [
  // --- Rating (Likert 1-5) ---
  {
    text: 'I enjoy writing and debugging code.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Technology: 1 },
  },
  {
    text: 'I like designing visual layouts and user interfaces.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Design: 1, Technology: 0.3 },
  },
  {
    text: 'I find it rewarding to help sick or injured people feel better.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Healthcare: 1 },
  },
  {
    text: 'I enjoy analyzing financial data and spotting trends.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Finance: 1 },
  },
  {
    text: 'I like explaining concepts and helping others learn.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Education: 1 },
  },
  {
    text: 'I enjoy running experiments and researching how things work.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Science: 1 },
  },
  {
    text: 'I like designing or building physical structures and machines.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Engineering: 1 },
  },
  {
    text: 'I enjoy working with my hands to fix or install things.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { 'Skilled Trades': 1 },
  },
  {
    text: 'I like debating and arguing points based on evidence.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Law: 1 },
  },
  {
    text: 'I enjoy developing strategies to grow a business or brand.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Business: 1, Finance: 0.3 },
  },
  {
    text: 'I like managing people and resolving workplace conflicts.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Business: 1 },
  },
  {
    text: 'I enjoy working with data to uncover patterns and insights.',
    type: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    timeLimitSeconds: 15,
    categoryWeights: { Technology: 0.6, Science: 0.6 },
  },

  // --- Slider (0-100) ---
  {
    text: 'How much do you enjoy solving complex logical puzzles?',
    type: 'slider',
    scaleMin: 0,
    scaleMax: 100,
    timeLimitSeconds: 15,
    categoryWeights: { Technology: 0.5, Science: 0.5 },
  },
  {
    text: 'How comfortable are you speaking in front of a group?',
    type: 'slider',
    scaleMin: 0,
    scaleMax: 100,
    timeLimitSeconds: 15,
    categoryWeights: { Business: 0.5, Education: 0.5, Law: 0.3 },
  },

  // --- Multiple choice ---
  {
    text: 'Which activity sounds most appealing for a weekend project?',
    type: 'multiple-choice',
    timeLimitSeconds: 20,
    options: [
      { label: 'Building a small app or website', value: 'app', categoryWeights: { Technology: 1 } },
      { label: 'Volunteering at a health clinic', value: 'clinic', categoryWeights: { Healthcare: 1 } },
      {
        label: 'Fixing something broken around the house',
        value: 'fix',
        categoryWeights: { 'Skilled Trades': 1, Engineering: 0.4 },
      },
      {
        label: 'Organizing a community fundraiser',
        value: 'fundraiser',
        categoryWeights: { Business: 0.6, Education: 0.4 },
      },
    ],
  },
  {
    text: "If you had to pick a college major unrelated to your career plans, you'd choose...",
    type: 'multiple-choice',
    timeLimitSeconds: 20,
    options: [
      { label: 'Computer Science', value: 'cs', categoryWeights: { Technology: 1 } },
      { label: 'Biology', value: 'bio', categoryWeights: { Healthcare: 0.6, Science: 1 } },
      { label: 'Fine Arts', value: 'arts', categoryWeights: { Design: 1 } },
      { label: 'Political Science', value: 'polisci', categoryWeights: { Law: 1, Business: 0.3 } },
    ],
  },
  {
    text: 'Which work environment excites you most?',
    type: 'multiple-choice',
    timeLimitSeconds: 20,
    options: [
      {
        label: 'A fast-paced startup building new tech',
        value: 'startup',
        categoryWeights: { Technology: 1, Business: 0.3 },
      },
      { label: 'A hospital or clinic', value: 'hospital', categoryWeights: { Healthcare: 1 } },
      {
        label: 'A workshop or job site',
        value: 'workshop',
        categoryWeights: { 'Skilled Trades': 1, Engineering: 0.5 },
      },
      { label: 'A courtroom or law office', value: 'courtroom', categoryWeights: { Law: 1 } },
    ],
  },
];

async function seed() {
  await connectDB();
  await QuizQuestion.deleteMany({});
  const inserted = await QuizQuestion.insertMany(
    questions.map((q, i) => ({ ...q, order: i }))
  );
  console.log(`[seed:quiz] Inserted ${inserted.length} quiz questions`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed:quiz] Failed:', err.message);
  process.exit(1);
});
