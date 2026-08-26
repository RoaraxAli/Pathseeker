const mongoose = require('mongoose');

const QUESTION_TYPES = ['rating', 'slider', 'multiple-choice'];

// Options only apply to 'multiple-choice' questions — each option carries
// its own category weights (e.g. picking "Fixing something broken" gives
// weight to both Skilled Trades and Engineering).
const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    categoryWeights: { type: Map, of: Number, default: {} },
  },
  { _id: false }
);

const quizQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: { type: String, enum: QUESTION_TYPES, required: true },
    order: { type: Number, default: 0 },
    timeLimitSeconds: { type: Number, default: 20 },

    // For 'rating' (Likert) and 'slider' questions: the answer value is
    // normalized to [0,1] across this range, then multiplied by each
    // category's weight below to produce that category's contribution.
    scaleMin: { type: Number, default: 1 },
    scaleMax: { type: Number, default: 5 },

    // Used directly by 'rating'/'slider' questions. Ignored for
    // 'multiple-choice', which instead uses per-option weights.
    categoryWeights: { type: Map, of: Number, default: {} },

    options: { type: [optionSchema], default: undefined }, // only for multiple-choice
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
module.exports.QUESTION_TYPES = QUESTION_TYPES;
