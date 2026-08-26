const Fuse = require('fuse.js');
const Career = require('../models/Career');

let fuse = null;

// Rebuilds the in-memory fuzzy-search index from the DB. Career datasets are
// small (dozens–hundreds of rows), so holding them all in memory is cheap and
// gives typo-tolerant search without needing a hosted search service.
async function rebuildIndex() {
  const careers = await Career.find().lean();
  fuse = new Fuse(careers, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'domain', weight: 0.2 },
      { name: 'requiredSkills', weight: 0.2 },
      { name: 'tags', weight: 0.1 },
    ],
    threshold: 0.3, // higher = more typo-tolerant, lower = stricter
    minMatchCharLength: 2,
    ignoreLocation: true,
    includeScore: true,
  });
  return fuse;
}

async function getIndex() {
  if (!fuse) await rebuildIndex();
  return fuse;
}

// Call this after any career create/update/delete so search stays fresh.
function invalidateIndex() {
  fuse = null;
}

module.exports = { getIndex, invalidateIndex, rebuildIndex };
