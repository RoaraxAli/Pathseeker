const mongoose = require('mongoose');

// Generalized bookmark: works across careers, media, and resources (the
// "articles/videos" from the spec) via itemType + itemId rather than a
// separate model per bookmarkable thing.
const ITEM_TYPES = ['career', 'media', 'resource', 'story'];

const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemType: { type: String, enum: ITEM_TYPES, required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    note: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
module.exports.ITEM_TYPES = ITEM_TYPES;
