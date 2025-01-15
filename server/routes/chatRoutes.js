const express = require('express');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/messages', async (req, res) => {
  const { sender, receiver, text } = req.body;
  console.log("Sender of the chat: ", sender);
  try {
    const senderDetails = await User.findById(sender);
    if (!senderDetails)
      return res.status(404).json({ error: "Sender not found" });

    const message = new Chat({ sender, receiver, text, timestamp: new Date() });
    await message.save();

    // Create a notification for the receiver
    const notification = new Notification({
      sender,
      receiver,
      message: `${senderDetails.name} sent you a message.`,
    });
    await notification.save();

    res.status(201).json({ success: true, message, notification });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch messages between two users
router.get('/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
