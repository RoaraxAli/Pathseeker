const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion', required: true },
        value: { type: mongoose.Schema.Types.Mixed }, // number (rating/slider) or string (option value)
      },
    ],
    // Per-category score, normalized 0-100.
    scores: { type: Map, of: Number, default: {} },
    topCategories: { type: [String], default: [] },
    suggestedCareers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Career' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
