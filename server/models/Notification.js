const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true }, // e.g. 'story_approved', 'story_rejected', 'system'
    message: { type: String, required: true },
    link: { type: String }, // client-side route to navigate to, optional
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
