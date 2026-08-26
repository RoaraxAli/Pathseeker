const mongoose = require('mongoose');

const MEDIA_TYPES = ['video', 'podcast', 'explainer'];
const RATING_TYPES = ['stars', 'thumbs'];

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: MEDIA_TYPES, required: true },
    domain: { type: String, trim: true }, // matches Career.domain for related-content matching
    tags: { type: [String], default: [] },
    description: { type: String, trim: true },

    // Either an external embed (YouTube etc.) or a locally-uploaded file.
    sourceType: { type: String, enum: ['external', 'upload'], required: true },
    externalUrl: { type: String, trim: true }, // required if sourceType === 'external'
    file: {
      filename: String, // name on disk
      originalName: String,
      mimeType: String,
      size: Number,
    },

    thumbnailUrl: { type: String, trim: true },
    transcript: { type: String, trim: true },
    durationSeconds: { type: Number },

    ratingType: { type: String, enum: RATING_TYPES, default: 'stars' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
module.exports.MEDIA_TYPES = MEDIA_TYPES;
module.exports.RATING_TYPES = RATING_TYPES;
