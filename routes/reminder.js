const express = require("express");
const router = express.Router();
const reminder = require("../models/reminder");
const auth = require("../middleware/auth");

//GET all reminders by user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const reminders = await reminder.find({
      userId,
    });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//POST a new reminder
router.post("/", auth, async (req, res) => {
  const newReminder = new reminder({
    title: req.body.title,
    description: req.body.description,
    time: req.body.time,
    date: req.body.date,
    category: req.body.category,
    userId: req.userId,
  });
  try {
    const savedReminder = await newReminder.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//PUT update a reminder
router.put("/:id", auth, async (req, res) => {
  try {
    const existingReminder = await reminder.findById(req.params.id);
    if (!existingReminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    if (existingReminder.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const updatedReminder = await reminder.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        time: req.body.time,
        date: req.body.date,
        category: req.body.category,
      },
      { new: true }
    );

    res.status(200).json(updatedReminder);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//DELETE a Reminder by userId
router.delete("/:id", auth, async (req, res) => {
  try {
    const reminderToDelete = await reminder.findById(req.params.id);
    if (!reminderToDelete) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }
    if (reminderToDelete.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    await reminderToDelete.deleteOne();
    res.json({
      message: "Reminder deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
