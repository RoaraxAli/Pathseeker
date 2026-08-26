const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    filters: {
      q: { type: String, default: '' },
      domain: { type: String, default: '' },
      skills: { type: [String], default: [] },
      salaryMin: { type: Number },
      salaryMax: { type: Number },
      demand: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
