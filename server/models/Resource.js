import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Resume Template',
        'Career Roadmap',
        'Interview Checklist',
        'Scholarship Guide',
        'Skill Cheat Sheet',
        'Infographic',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    previewSnippet: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'PDF',
    },
    fileSize: {
      type: String,
      default: '2.4 MB',
    },
    tags: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: [String],
      enum: ['student', 'graduate', 'professional', 'all'],
      default: ['all'],
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Resource = mongoose.model('Resource', resourceSchema);
