import { Resource } from '../models/Resource.js';

// @desc   Get all downloadable resources
// @route  GET /api/resources
export const getResources = async (req, res) => {
  try {
    const { category, targetAudience, search } = req.query;
    let query = {};

    if (category && category !== 'all' && category !== 'All Categories') {
      query.category = category;
    }

    if (targetAudience && targetAudience !== 'all') {
      query.targetAudience = { $in: [targetAudience, 'all'] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const resources = await Resource.find(query).sort({ isPopular: -1, downloadsCount: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch document resources' });
  }
};

// @desc   Track download and return download stream metadata
// @route  POST /api/resources/:id/download
export const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.downloadsCount = (resource.downloadsCount || 0) + 1;
    await resource.save();

    res.json({
      downloadsCount: resource.downloadsCount,
      fileUrl: resource.fileUrl,
      title: resource.title,
      message: 'Download initiated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to track download' });
  }
};

// @desc   Admin: Create resource
// @route  POST /api/resources
export const createResource = async (req, res) => {
  try {
    const { title, category, description, fileUrl, previewSnippet, fileType, fileSize, tags, targetAudience, isPopular } = req.body;

    const newResource = await Resource.create({
      title,
      category,
      description,
      fileUrl,
      previewSnippet: previewSnippet || description,
      fileType: fileType || 'PDF',
      fileSize: fileSize || '2.0 MB',
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      targetAudience: targetAudience || ['all'],
      isPopular: !!isPopular,
    });

    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create resource' });
  }
};

// @desc   Admin: Update resource
// @route  PUT /api/resources/:id
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    Object.assign(resource, req.body);
    const updated = await resource.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update resource' });
  }
};

// @desc   Admin: Delete resource
// @route  DELETE /api/resources/:id
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete resource' });
  }
};
