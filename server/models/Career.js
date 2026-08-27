import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true, // e.g. 'Software & Cloud', 'AI & Data Science', 'Cybersecurity', 'Design & UX', 'Healthcare & Biotech', 'Fintech & Business', 'Product & Strategy'
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: '',
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    educationPath: {
      type: String,
      required: true,
    },
    salaryRange: {
      entry: { type: Number, required: true },
      mid: { type: Number, required: true },
      senior: { type: Number, required: true },
      currency: { type: String, default: 'USD ($)' },
    },
    jobDemand: {
      type: String,
      enum: ['Explosive', 'High', 'Moderate'],
      default: 'High',
    },
    growthRate: {
      type: String,
      default: '+22% (2024-2030)',
    },
    certifications: {
      type: [String],
      default: [],
    },
    dailyTasks: {
      type: [String],
      default: [],
    },
    recommendedCourses: [
      {
        name: { type: String, required: true },
        platform: { type: String, default: 'Online' },
        link: { type: String, default: '#' },
      },
    ],
    targetAudience: {
      type: [String],
      enum: ['student', 'graduate', 'professional'],
      default: ['student', 'graduate', 'professional'],
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
    },
    iconName: {
      type: String,
      default: 'Code',
    },
  },
  {
    timestamps: true,
  }
);

export const Career = mongoose.model('Career', careerSchema);
