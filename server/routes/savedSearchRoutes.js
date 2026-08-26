const express = require('express');
const SavedSearch = require('../models/SavedSearch');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET /api/saved-searches — the current user's saved filter sets.
router.get('/', async (req, res) => {
  try {
    const searches = await SavedSearch.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ savedSearches: searches });
  } catch (err) {
    console.error('[saved-searches GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching saved searches' });
  }
});

// POST /api/saved-searches — save the current filter set under a name.
router.post('/', async (req, res) => {
  try {
    const { name, filters } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const search = await SavedSearch.create({ user: req.user._id, name, filters: filters || {} });
    res.status(201).json({ savedSearch: search });
  } catch (err) {
    console.error('[saved-searches POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not save search' });
  }
});

// DELETE /api/saved-searches/:id — only the owner can delete their own.
router.delete('/:id', async (req, res) => {
  try {
    const search = await SavedSearch.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!search) return res.status(404).json({ error: 'Saved search not found' });
    res.json({ message: 'Saved search deleted' });
  } catch (err) {
    console.error('[saved-searches DELETE] error:', err.message);
    res.status(400).json({ error: 'Invalid saved search id' });
  }
});

module.exports = router;
