const mongoose = require('mongoose');

const FEEDBACK_TYPES = ['bug', 'suggestion', 'query'];
const FEEDBACK_STATUSES = ['open', 'reviewed', 'resolved'];

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for anonymous submissions
    email: { type: String, trim: true }, // contact email, especially when anonymous
    type: { type: String, enum: FEEDBACK_TYPES, required: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: FEEDBACK_STATUSES, default: 'open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
module.exports.FEEDBACK_TYPES = FEEDBACK_TYPES;
module.exports.FEEDBACK_STATUSES = FEEDBACK_STATUSES;
