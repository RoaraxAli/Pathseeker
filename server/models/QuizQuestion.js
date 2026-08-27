import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    traitScores: {
      tech: { type: Number, default: 0 },
      data: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      leadership: { type: Number, default: 0 },
      healthcare: { type: Number, default: 0 },
      cybersecurity: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const quizQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General Interest',
    },
    type: {
      type: String,
      enum: ['likert', 'scenario', 'slider', 'multiple_choice'],
      default: 'multiple_choice',
    },
    options: [optionSchema],
    timeLimitSec: {
      type: Number,
      default: 45,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
