import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    photoURL: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'graduate', 'professional', 'admin', 'customer'],
      default: 'student',
    },
    educationLevel: {
      type: String,
      default: 'Undergraduate',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    workExperience: {
      type: String,
      default: '',
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    targetRole: {
      type: String,
      default: 'Full-Stack Developer',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    readinessScore: {
      type: Number,
      default: 72,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other', ''],
      default: '',
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
