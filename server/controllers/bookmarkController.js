import { Bookmark } from '../models/Bookmark.js';
import { Career } from '../models/Career.js';

// @desc   Get user bookmarks with sticky notes
// @route  GET /api/bookmarks
export const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch bookmarks' });
  }
};

// @desc   Toggle or add a bookmark
// @route  POST /api/bookmarks
export const toggleBookmark = async (req, res) => {
  try {
    const { itemType, itemId, title, subtitle, notes, tags } = req.body;

    const existing = await Bookmark.findOne({
      userId: req.user._id,
      itemType,
      itemId,
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      if (itemType === 'career') {
        await Career.findByIdAndUpdate(itemId, { $inc: { bookmarkCount: -1 } }).catch(() => {});
      }
      return res.json({ bookmarked: false, message: 'Bookmark removed' });
    }

    const newBookmark = await Bookmark.create({
      userId: req.user._id,
      itemType,
      itemId,
      title: title || 'Saved Item',
      subtitle: subtitle || '',
      notes: notes || '',
      tags: Array.isArray(tags) ? tags : [],
    });

    if (itemType === 'career') {
      await Career.findByIdAndUpdate(itemId, { $inc: { bookmarkCount: 1 } }).catch(() => {});
    }

    res.status(201).json({ bookmarked: true, bookmark: newBookmark, message: 'Bookmark added' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to toggle bookmark' });
  }
};

// @desc   Update sticky notes on a bookmark
// @route  PUT /api/bookmarks/:id/notes
export const updateBookmarkNotes = async (req, res) => {
  try {
    const { notes, tags } = req.body;
    const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.user._id });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    if (notes !== undefined) bookmark.notes = notes;
    if (tags !== undefined) bookmark.tags = tags;

    await bookmark.save();
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update sticky notes' });
  }
};

// @desc   Delete a bookmark
// @route  DELETE /api/bookmarks/:id
export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete bookmark' });
  }
};
