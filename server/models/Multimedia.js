import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false }
);

const multimediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['video', 'podcast', 'explainer'],
      default: 'video',
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      default: '12:45',
    },
    speaker: {
      name: { type: String, default: 'Industry Mentor' },
      role: { type: String, default: 'Senior Specialist' },
      company: { type: String, default: 'Tech Innovations' },
      avatar: { type: String, default: '' },
    },
    tags: {
      type: [String],
      default: [],
    },
    transcript: {
      type: String,
      default: '',
    },
    ratings: [ratingSchema],
    ratingAvg: {
      type: Number,
      default: 4.8,
    },
    ratingCount: {
      type: Number,
      default: 1,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    targetAudience: {
      type: [String],
      enum: ['student', 'graduate', 'professional'],
      default: ['student', 'graduate', 'professional'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Multimedia = mongoose.model('Multimedia', multimediaSchema);
