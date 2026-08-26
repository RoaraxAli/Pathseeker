const mongoose = require('mongoose');

const STATUSES = ['pending', 'approved', 'rejected'];

const successStorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    authorName: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    domain: { type: String, trim: true },
    tags: { type: [String], default: [] },
    storyDate: { type: Date, default: Date.now }, // used for timeline ordering
    imageUrl: { type: String, trim: true },

    status: { type: String, enum: STATUSES, default: 'pending' },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SuccessStory', successStorySchema);
module.exports.STATUSES = STATUSES;
