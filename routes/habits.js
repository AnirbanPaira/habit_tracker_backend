const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

// GET all habits for a user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const habits = await Habit.find({ userId });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single habit
router.get('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    
    if (habit.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new habit
router.post('/', auth, async (req, res) => {
  const habit = new Habit({
    name: req.body.name,
    description: req.body.description,
    frequency: req.body.frequency,
    userId: req.userId
  });

  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a habit
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    if (habit.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.body.name != null) habit.name = req.body.name;
    if (req.body.description != null) habit.description = req.body.description;
    if (req.body.frequency != null) habit.frequency = req.body.frequency;
    if (req.body.completed != null) habit.completed = req.body.completed;

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a habit
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    if (habit.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await habit.remove();
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
