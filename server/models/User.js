const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['student', 'graduate', 'professional', 'admin'];

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true, trim: true },
    degree: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startYear: { type: Number },
    endYear: { type: Number },
  },
  { _id: true }
);

const workExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date }, // omitted/null = still working there
    description: { type: String, trim: true },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'student' },
    lastLoginAt: { type: Date }, // set on each successful login — powers "active users" in admin analytics

    // Set only while a password-reset OTP is pending; cleared after use or expiry.
    resetOTPHash: { type: String, select: false },
    resetOTPExpires: { type: Date, select: false },

    // Profile (Phase 2)
    education: { type: [educationSchema], default: [] },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    workExperience: { type: [workExperienceSchema], default: [] },
    resume: {
      filename: { type: String }, // name on disk, used to serve/delete the file
      originalName: { type: String },
      mimeType: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
