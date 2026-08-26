const express = require('express');
const Career = require('../models/Career');
const { protect, requireRole } = require('../middleware/auth');
const { getIndex, invalidateIndex } = require('../utils/careerSearchIndex');

const router = express.Router();

// Fuse's per-field threshold still lets weakly-related hits through when a
// query fuzzy-matches an unrelated field. Drop anything past this score
// (0 = perfect match, 1 = totally unrelated) regardless of key weighting.
const MAX_RELEVANCE_SCORE = 0.52;

// GET /api/careers — list + filter (domain, skills, salary range, demand).
// Public: browsing the career bank doesn't require login.
router.get('/', async (req, res) => {
  try {
    const { domain, skills, salaryMin, salaryMax, demand, page = 1, limit = 50 } = req.query;
    const query = {};

    if (domain) query.domain = domain;
    if (demand) query.jobDemand = demand;
    if (skills) {
      const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
      if (skillList.length) {
        query.requiredSkills = { $in: skillList.map((s) => new RegExp(`^${s}$`, 'i')) };
      }
    }
    if (salaryMin || salaryMax) {
      // A career matches if its range overlaps the requested [min, max] window.
      query['salaryRange.max'] = { $gte: Number(salaryMin) || 0 };
      if (salaryMax) query['salaryRange.min'] = { $lte: Number(salaryMax) };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));

    const [careers, total] = await Promise.all([
      Career.find(query)
        .sort({ title: 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Career.countDocuments(query),
    ]);

    res.json({ careers, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error('[careers GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching careers' });
  }
});

// GET /api/careers/meta — distinct values to populate filter dropdowns.
router.get('/meta', async (req, res) => {
  try {
    const [domains, skills] = await Promise.all([
      Career.distinct('domain'),
      Career.distinct('requiredSkills'),
    ]);
    res.json({
      domains: domains.sort(),
      skills: skills.sort(),
      demandLevels: ['low', 'medium', 'high'],
    });
  } catch (err) {
    console.error('[careers/meta GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching filter options' });
  }
});

// GET /api/careers/search?q= — fuzzy, typo-tolerant search over title/domain/skills/tags.
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(50, Number(req.query.limit) || 20);
    if (!q) return res.json({ careers: [] });

    const index = await getIndex();
    const results = index
      .search(q, { limit })
      .filter((r) => r.score <= MAX_RELEVANCE_SCORE)
      .map((r) => r.item);
    res.json({ careers: results });
  } catch (err) {
    console.error('[careers/search GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong searching careers' });
  }
});

// GET /api/careers/suggest?q= — lightweight autocomplete: just titles, typo-tolerant.
router.get('/suggest', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(10, Number(req.query.limit) || 6);
    if (!q) return res.json({ suggestions: [] });

    const index = await getIndex();
    const results = index
      .search(q, { limit })
      .filter((r) => r.score <= MAX_RELEVANCE_SCORE)
      .map((r) => ({ id: r.item._id, title: r.item.title }));
    res.json({ suggestions: results });
  } catch (err) {
    console.error('[careers/suggest GET] error:', err.message);
    res.status(500).json({ error: 'Something went wrong fetching suggestions' });
  }
});

// GET /api/careers/:id — single career detail. Kept below the static routes
// above so 'meta'/'search'/'suggest' aren't swallowed as an :id.
router.get('/:id', async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.json({ career });
  } catch (err) {
    res.status(400).json({ error: 'Invalid career id' });
  }
});

// POST /api/careers — admin only.
router.post('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const career = await Career.create(req.body);
    invalidateIndex();
    res.status(201).json({ career });
  } catch (err) {
    console.error('[careers POST] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not create career' });
  }
});

// PUT /api/careers/:id — admin only.
router.put('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!career) return res.status(404).json({ error: 'Career not found' });
    invalidateIndex();
    res.json({ career });
  } catch (err) {
    console.error('[careers PUT] error:', err.message);
    res.status(400).json({ error: err.message || 'Could not update career' });
  }
});

// DELETE /api/careers/:id — admin only.
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    invalidateIndex();
    res.json({ message: 'Career deleted' });
  } catch (err) {
    console.error('[careers DELETE] error:', err.message);
    res.status(500).json({ error: 'Could not delete career' });
  }
});

module.exports = router;
