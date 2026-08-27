import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['bug', 'suggestion', 'query', 'appreciation'],
      default: 'suggestion',
    },
    subject: {
      type: String,
      default: 'User Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'urgent'],
      default: 'positive',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
    adminResponse: {
      type: String,
      default: '',
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
