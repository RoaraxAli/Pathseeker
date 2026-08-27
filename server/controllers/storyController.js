import { SuccessStory } from '../models/SuccessStory.js';

// @desc   Get approved and featured success stories
// @route  GET /api/stories
export const getStories = async (req, res) => {
  try {
    const { domain, search } = req.query;
    let query = { status: { $in: ['approved', 'featured'] } };

    if (domain && domain !== 'all' && domain !== 'All Domains') {
      query.domain = domain;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { currentRole: { $regex: search, $options: 'i' } },
        { challenges: { $regex: search, $options: 'i' } },
        { advice: { $regex: search, $options: 'i' } },
      ];
    }

    const stories = await SuccessStory.find(query).sort({ status: -1, likesCount: -1, createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch success stories' });
  }
};

// @desc   Get single story by ID
// @route  GET /api/stories/:id
export const getStoryById = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch story' });
  }
};

// @desc   Submit a user success story (status defaults to pending or approved)
// @route  POST /api/stories
export const submitStory = async (req, res) => {
  try {
    const { name, domain, currentRole, company, educationPath, challenges, milestones, outcome, advice, avatarUrl } = req.body;

    const newStory = await SuccessStory.create({
      name: name || (req.user ? req.user.displayName : 'Anonymous Pioneer'),
      domain: domain || 'Software & Cloud',
      currentRole: currentRole || 'Tech Specialist',
      company: company || 'Self-Employed / Innovator',
      educationPath,
      challenges,
      milestones: Array.isArray(milestones) ? milestones : [],
      outcome,
      advice,
      avatarUrl: avatarUrl || (req.user?.photoURL ? req.user.photoURL : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'),
      submittedBy: req.user ? req.user._id : null,
      status: req.user?.role === 'admin' ? 'approved' : 'approved', // instantly approved for demo agility or pending
      likesCount: 1,
    });

    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to submit success story' });
  }
};

// @desc   Like a story
// @route  POST /api/stories/:id/like
export const likeStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    story.likesCount = (story.likesCount || 0) + 1;
    await story.save();
    res.json({ likesCount: story.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to like story' });
  }
};

// @desc   Admin: Get all stories (including pending)
// @route  GET /api/stories/admin/all
export const getAdminStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({}).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch admin stories' });
  }
};

// @desc   Admin: Update story status (approve/reject/feature)
// @route  PUT /api/stories/:id/status
export const updateStoryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    story.status = status;
    await story.save();
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update story status' });
  }
};

// @desc   Admin: Delete story
// @route  DELETE /api/stories/:id
export const deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete story' });
  }
};
