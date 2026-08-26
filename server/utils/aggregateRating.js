const MediaRating = require('../models/MediaRating');

// Returns a summary shaped for the media's ratingType:
//   stars:  { type: 'stars',  average: Number|null, count: Number }
//   thumbs: { type: 'thumbs', upCount, downCount, percentUp: Number|null, count: Number }
async function aggregateRating(mediaId, ratingType) {
  const ratings = await MediaRating.find({ media: mediaId });

  if (ratingType === 'thumbs') {
    const upCount = ratings.filter((r) => r.thumbs === 'up').length;
    const downCount = ratings.filter((r) => r.thumbs === 'down').length;
    const count = upCount + downCount;
    return {
      type: 'thumbs',
      upCount,
      downCount,
      percentUp: count ? Math.round((upCount / count) * 100) : null,
      count,
    };
  }

  const starValues = ratings.filter((r) => typeof r.stars === 'number').map((r) => r.stars);
  const count = starValues.length;
  return {
    type: 'stars',
    average: count ? Math.round((starValues.reduce((a, b) => a + b, 0) / count) * 10) / 10 : null,
    count,
  };
}

module.exports = aggregateRating;
