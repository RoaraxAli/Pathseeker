import { Multimedia } from '../models/Multimedia.js';

// @desc   Get all multimedia resources
// @route  GET /api/multimedia
export const getMultimedia = async (req, res) => {
  try {
    const { type, domain, search, featured } = req.query;
    let query = {};

    if (type && type !== 'all') {
      query.type = type;
    }
    if (domain && domain !== 'all') {
      query.domain = domain;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { transcript: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Multimedia.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch multimedia items' });
  }
};

// @desc   Get single multimedia by ID
// @route  GET /api/multimedia/:id
export const getMultimediaById = async (req, res) => {
  try {
    const item = await Multimedia.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Multimedia content not found' });
    }

    item.viewsCount = (item.viewsCount || 0) + 1;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch multimedia content' });
  }
};

// @desc   Rate a multimedia item (1-5 stars)
// @route  POST /api/multimedia/:id/rate
export const rateMultimedia = async (req, res) => {
  try {
    const { rating } = req.body;
    const numRating = Number(rating);

    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const item = await Multimedia.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Multimedia content not found' });
    }

    const userId = req.user ? req.user._id.toString() : 'guest_' + req.ip;
    const existingIndex = item.ratings.findIndex((r) => r.userId === userId);

    if (existingIndex > -1) {
      item.ratings[existingIndex].rating = numRating;
    } else {
      item.ratings.push({ userId, rating: numRating });
    }

    const total = item.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    item.ratingCount = item.ratings.length;
    item.ratingAvg = Number((total / item.ratings.length).toFixed(1));

    await item.save();
    res.json({ ratingAvg: item.ratingAvg, ratingCount: item.ratingCount, message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to rate multimedia' });
  }
};

// @desc   Create multimedia (Admin)
// @route  POST /api/multimedia
export const createMultimedia = async (req, res) => {
  try {
    const { title, type, url, thumbnailUrl, domain, duration, speaker, tags, transcript, targetAudience, isFeatured } = req.body;

    const newItem = await Multimedia.create({
      title,
      type: type || 'video',
      url,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
      domain: domain || 'General',
      duration: duration || '10:00',
      speaker: speaker || { name: 'PathSeeker Mentor', role: 'Career Specialist', company: 'Tech Lead' },
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      transcript: transcript || '',
      targetAudience: targetAudience || ['student', 'graduate', 'professional'],
      isFeatured: !!isFeatured,
      ratingAvg: 5.0,
      ratingCount: 1,
      ratings: [{ userId: 'system', rating: 5 }],
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create multimedia' });
  }
};

// @desc   Update multimedia (Admin)
// @route  PUT /api/multimedia/:id
export const updateMultimedia = async (req, res) => {
  try {
    const item = await Multimedia.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Multimedia not found' });
    }

    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update multimedia' });
  }
};

// @desc   Delete multimedia (Admin)
// @route  DELETE /api/multimedia/:id
export const deleteMultimedia = async (req, res) => {
  try {
    const item = await Multimedia.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Multimedia not found' });
    }
    res.json({ message: 'Multimedia deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete multimedia' });
  }
};
