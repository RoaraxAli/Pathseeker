const mongoose = require('mongoose');

// A share is a read-only SNAPSHOT of a user's bookmarks at share time —
// deliberately not a live reference, so later bookmark edits/deletes don't
// silently change what was already shared with someone else.
const bookmarkShareSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    items: [
      {
        itemType: String,
        title: String,
        note: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('BookmarkShare', bookmarkShareSchema);
