const express = require('express');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const Career = require('../models/Career');
const { protect, requireRole } = require('../middleware/auth');
const scoreQuiz = require('../utils/scoreQuiz');

const router = express.Router();

// The whole quiz is personal (results and history are per-user), so
// everything here requires login — consistent with saved-searches.
router.use(protect);

// GET /api/quiz/questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await QuizQuestion.find().sort({ order: 1 }).lean();
    // Category weights are only needed for scoring on the backend — strip
    // them out of what's sent to the client so answers can't be reverse-
    // engineered to game a specific result.
    const sanitized = questions.map((q) => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      order: q.order,
      timeLimitSeconds: q.timeLimitSeconds,
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      options: q.options?.map((o) => ({ label: o.label, value: o.value })),
    }));
    res.json({ questions: sanitized });
  } catch (err) {
    console.error('[quiz/questions GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching quiz questions' });
  }
});

// POST /api/quiz/submit — body: { answers: [{ question, value }] }
router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers must be a non-empty array' });
    }

    // Not .lean() — scoring needs categoryWeights as real Maps (see utils/scoreQuiz).
    const allQuestions = await QuizQuestion.find();
    if (allQuestions.length === 0) {
      return res.status(409).json({ error: 'No quiz questions are configured yet' });
    }

    const { scores, topCategories } = scoreQuiz(allQuestions, answers);

    let suggestedCareers = [];
    if (topCategories.length > 0) {
      suggestedCareers = await Career.find({ domain: { $in: topCategories } })
        .sort({ jobDemand: -1, title: 1 })
        .limit(9);
    }

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      answers: answers.map((a) => ({ question: a.question, value: a.value })),
      scores,
      topCategories,
      suggestedCareers: suggestedCareers.map((c) => c._id),
    });

    res.status(201).json({
      attemptId: attempt._id,
      scores,
      topCategories,
      suggestedCareers,
    });
  } catch (err) {
    console.error('[quiz/submit POST] error:', err.message);
    res.status(500).json({ error: 'Something went wrong scoring the quiz' });
  }
});

// GET /api/quiz/history — the current user's past attempts, most recent first.
router.get('/history', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('suggestedCareers');
    res.json({ attempts });
  } catch (err) {
    console.error('[quiz/history GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching quiz history' });
  }
});

// GET /api/quiz/history/:id — one past attempt, owner-only.
router.get('/history/:id', async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('suggestedCareers');
    if (!attempt) return res.status(404).json({ error: 'Quiz attempt not found' });
    res.json({ attempt });
  } catch (err) {
    res.status(400).json({ error: 'Invalid attempt id' });
  }
});

// --- Admin: quiz question management ---
// (Previously only seedable via script; this is the actual CRUD.)

// GET /api/quiz/admin/questions — admin only, full data incl. categoryWeights.
router.get('/admin/questions', requireRole('admin'), async (req, res) => {
  try {
    const questions = await QuizQuestion.find().sort({ order: 1 });
    res.json({ questions });
  } catch (err) {
    console.error('[quiz/admin/questions GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching questions' });
  }
});

// POST /api/quiz/admin/questions — admin only.
router.post('/admin/questions', requireRole('admin'), async (req, res) => {
  try {
    const question = await QuizQuestion.create(req.body);
    res.status(201).json({ question });
  } catch (err) {
    console.error('[quiz/admin/questions POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not create question' });
  }
});

// PUT /api/quiz/admin/questions/:id — admin only.
router.put('/admin/questions/:id', requireRole('admin'), async (req, res) => {
  try {
    const question = await QuizQuestion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ question });
  } catch (err) {
    console.error('[quiz/admin/questions PUT] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not update question' });
  }
});

// DELETE /api/quiz/admin/questions/:id — admin only.
router.delete('/admin/questions/:id', requireRole('admin'), async (req, res) => {
  try {
    const question = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid question id' });
  }
});

module.exports = router;
