import { Career } from '../models/Career.js';

// @desc   Get all careers with filtering, search, and sorting
// @route  GET /api/careers
export const getCareers = async (req, res) => {
  try {
    const { search, domain, demand, targetAudience, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (domain && domain !== 'all' && domain !== 'All Domains') {
      query.domain = domain;
    }

    if (demand && demand !== 'all') {
      query.jobDemand = demand;
    }

    if (targetAudience && targetAudience !== 'all') {
      query.targetAudience = { $in: [targetAudience] };
    }

    let sortOption = { isTrending: -1, viewsCount: -1 };
    if (sort === 'salary') {
      sortOption = { 'salaryRange.senior': -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    }

    const careers = await Career.find(query).sort(sortOption);
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch careers' });
  }
};

// @desc   Get single career by ID or Slug
// @route  GET /api/careers/:id
export const getCareerById = async (req, res) => {
  try {
    const { id } = req.params;
    let career = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      career = await Career.findById(id);
    }
    if (!career) {
      career = await Career.findOne({ slug: id });
    }

    if (!career) {
      return res.status(404).json({ message: 'Career profile not found' });
    }

    // Increment views count
    career.viewsCount = (career.viewsCount || 0) + 1;
    await career.save();

    res.json(career);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch career' });
  }
};

// @desc   Create new career (Admin)
// @route  POST /api/careers
export const createCareer = async (req, res) => {
  try {
    const {
      title,
      domain,
      description,
      summary,
      requiredSkills,
      educationPath,
      salaryRange,
      jobDemand,
      growthRate,
      certifications,
      dailyTasks,
      recommendedCourses,
      targetAudience,
      isTrending,
      iconName,
    } = req.body;

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCareer = await Career.create({
      title,
      slug,
      domain,
      description,
      summary: summary || description.slice(0, 140) + '...',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map((s) => s.trim()),
      educationPath,
      salaryRange: salaryRange || { entry: 60000, mid: 100000, senior: 150000, currency: 'USD ($)' },
      jobDemand: jobDemand || 'High',
      growthRate: growthRate || '+20% (2024-2030)',
      certifications: certifications || [],
      dailyTasks: dailyTasks || [],
      recommendedCourses: recommendedCourses || [],
      targetAudience: targetAudience || ['student', 'graduate', 'professional'],
      isTrending: !!isTrending,
      iconName: iconName || 'Briefcase',
    });

    res.status(201).json(newCareer);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create career profile' });
  }
};

// @desc   Update career (Admin)
// @route  PUT /api/careers/:id
export const updateCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Career profile not found' });
    }

    Object.assign(career, req.body);
    const updated = await career.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update career' });
  }
};

// @desc   Delete career (Admin)
// @route  DELETE /api/careers/:id
export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Career profile not found' });
    }
    res.json({ message: 'Career profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete career' });
  }
};
