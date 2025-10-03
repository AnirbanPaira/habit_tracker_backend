const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// GET all categories for a user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const categories = await Category.find({ userId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new category
router.post('/', auth, async (req, res) => {
  const category = new Category({
    name: req.body.name,
    userId: req.userId
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a category
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    category.name = req.body.name;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
