const router = require('express').Router();
const Category = require('../models/Category');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const auth = require('../middleware/authMiddleware');

// Helper to log user activity
async function logActivity(userId, action, details) {
  try {
    const activity = new Activity({ user: userId, action, details });
    await activity.save();
  } catch (err) {
    console.error('Activity logging failed:', err);
  }
}

// Helper to generate a clean URL slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

// GET all categories for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// CREATE a new category
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    // Check if category name already exists for this user
    const existing = await Category.findOne({ user: req.user, name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      user: req.user,
      name: trimmedName,
      slug
    });

    await category.save();
    await logActivity(req.user, 'Created Category', trimmedName);

    res.status(201).json(category);
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ message: 'Server error creating category' });
  }
});

// UPDATE an existing category
router.put('/:id', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    // Check if category exists
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to edit this category' });
    }

    // Check if new name conflicts with another category
    const duplicate = await Category.findOne({ 
      user: req.user, 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      _id: { $ne: req.params.id }
    });
    if (duplicate) {
      return res.status(400).json({ message: 'Another category with this name already exists' });
    }

    const oldName = category.name;
    category.name = trimmedName;
    category.slug = slug;

    await category.save();
    
    // Also update category name on any projects associated with this category
    await Project.updateMany(
      { user: req.user, category: oldName },
      { $set: { category: trimmedName } }
    );

    await logActivity(req.user, 'Updated Category', `${oldName} -> ${trimmedName}`);

    res.json(category);
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ message: 'Server error updating category' });
  }
});

// DELETE a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to delete this category' });
    }

    const categoryName = category.name;

    // Delete the category
    await Category.findByIdAndDelete(req.params.id);

    // Reassign all projects in this category to 'Uncategorized' to keep them safe
    await Project.updateMany(
      { user: req.user, category: categoryName },
      { $set: { category: 'Uncategorized' } }
    );

    await logActivity(req.user, 'Deleted Category', categoryName);

    res.json({ message: `Category '${categoryName}' deleted successfully. Associated projects moved to 'Uncategorized'.` });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

module.exports = router;
