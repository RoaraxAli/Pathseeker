import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scores: {
      tech: { type: Number, default: 0 },
      data: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      leadership: { type: Number, default: 0 },
      healthcare: { type: Number, default: 0 },
      cybersecurity: { type: Number, default: 0 },
    },
    primaryDomain: {
      type: String,
      default: 'Software & Cloud',
    },
    recommendedCareers: [
      {
        title: { type: String, required: true },
        matchPercentage: { type: Number, required: true },
        domain: { type: String, default: '' },
      },
    ],
    answersCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
