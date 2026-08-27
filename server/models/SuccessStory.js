import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const successStorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    currentRole: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      default: 'Global Tech Leader',
      trim: true,
    },
    educationPath: {
      type: String,
      required: true,
    },
    challenges: {
      type: String,
      required: true,
    },
    milestones: [milestoneSchema],
    outcome: {
      type: String,
      required: true,
    },
    advice: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'featured'],
      default: 'approved',
    },
    likesCount: {
      type: Number,
      default: 12,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
