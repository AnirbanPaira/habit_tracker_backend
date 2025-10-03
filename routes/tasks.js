const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET all tasks for a user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (task.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new task
router.post('/', auth, async (req, res) => {
  const task = new Task({
    name: req.body.name,
    description: req.body.description,
    frequency: req.body.frequency,
    category: req.body.category || 'todo',
    userId: req.userId
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.body.name != null) task.name = req.body.name;
    if (req.body.description != null) task.description = req.body.description;
    if (req.body.frequency != null) task.frequency = req.body.frequency;
    if (req.body.category != null) task.category = req.body.category;
    if (req.body.completed != null) task.completed = req.body.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
