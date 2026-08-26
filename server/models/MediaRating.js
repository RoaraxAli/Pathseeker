const mongoose = require('mongoose');

const mediaRatingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
    stars: { type: Number, min: 1, max: 5 }, // set when media.ratingType === 'stars'
    thumbs: { type: String, enum: ['up', 'down'] }, // set when media.ratingType === 'thumbs'
  },
  { timestamps: true }
);

// One rating per user per media item — resubmitting updates it (upsert).
mediaRatingSchema.index({ user: 1, media: 1 }, { unique: true });

module.exports = mongoose.model('MediaRating', mediaRatingSchema);
