const express = require('express');
const Notification = require('../models/Notification');
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.find({ receiver: userId, read: false }).populate('sender', 'name email');
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
