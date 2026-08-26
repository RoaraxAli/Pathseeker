const mongoose = require('mongoose');

const DEMAND_LEVELS = ['low', 'medium', 'high'];

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true }, // e.g. "Technology", "Healthcare"
    description: { type: String, trim: true },
    requiredSkills: { type: [String], default: [] },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    jobDemand: { type: String, enum: DEMAND_LEVELS, default: 'medium' },
    tags: { type: [String], default: [] }, // extra searchable keywords
  },
  { timestamps: true }
);

careerSchema.index({ title: 'text', domain: 'text', description: 'text' });

module.exports = mongoose.model('Career', careerSchema);
module.exports.DEMAND_LEVELS = DEMAND_LEVELS;
