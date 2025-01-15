const User = require("../models/User");
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const getCoordinates = require("../utils/geocoding");
const calculateDistances = require("../utils/distance");


const getChatHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2))
      return res.status(400).json({ message: "Invalid user IDs" });

    const chats = await Chat.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chat history:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getChatNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ receiver: userId, read: false }).populate('sender', 'name email');
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const currentAddress = `${currentUser.city}, ${currentUser.state}, ${currentUser.country}`;
    const currentUserCoords = await getCoordinates(currentAddress);
    if (!currentUserCoords)
      return res.status(500).json({ message: "Failed to fetch current user coordinates" });

    const potentialUsers = await User.find({
      expertise: currentUser.interests,
      interests: { $in: currentUser.expertise },
      _id: { $ne: req.user.id },
      _id: { $nin: currentUser.connections },
    });

    const targetCoords = await Promise.all(
      potentialUsers.map(async (user) => {
        const address = `${user.city}, ${user.state}, ${user.country}`;
        return await getCoordinates(address);
      })
    );

    const validTargetCoords = targetCoords.filter((coords) => coords !== null);
    if (validTargetCoords.length === 0)
      return res.status(200).json({ message: "No recommendations found" });

    const distances = await calculateDistances(currentUserCoords, validTargetCoords);

    const recommendations = potentialUsers
      .map((user, index) => {
        if (distances[index] !== undefined) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            city: user.city,
            state: user.state,
            country: user.country,
            expertise: user.expertise,
            interests: user.interests,
            distance: distances[index],
          };
        }
        return null;
      })
      .filter((item) => item !== null)
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");    
    if (!user)
      return res.status(404).json({ message: "User not found" });
    const currentUser = await User.findById(req.user.id);

    const isConnected = currentUser.connections.includes(user._id);
    const hasRequest = user.notifications.some(
      (notification) =>
        notification.sender.toString() === req.user.id &&
        notification.message.includes("wants to connect")
    );

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      state: user.state,
      country: user.country,
      expertise: user.expertise,
      interests: user.interests,
      requestSent: hasRequest,
      isConnected: isConnected,
    });
  } catch (err) {
    console.error("This is the error: ", err.message);
    res.status(500).json({ message: "Failed to load profile details" });
  }
};


const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const connectUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser)
      return res.status(404).json({ message: "User not found" });

    if (!currentUser.connections) currentUser.connections = [];
    if (currentUser.connections.includes(targetUser._id))
      return res.status(400).json({ message: "Already connected" });

    if (!targetUser.notifications) targetUser.notifications = [];
    targetUser.notifications.push({
      sender: currentUser._id,
      message: `${currentUser.name} wants to connect with you.`,
      status: "new",
    });

    await targetUser.save();
    res.status(200).json({ message: "Connection request sent." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const confirmConnection = async (req, res) => {
  try {
    const senderId = req.params.id;
    const receiverId = req.user.id;
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender)
      return res.status(404).json({ message: "User not found" });

    if (!receiver.connections.includes(senderId))
      receiver.connections.unshift(senderId);
    if (!sender.connections.includes(receiverId))
      sender.connections.unshift(receiverId);

    sender.notifications.unshift({
      sender: receiver._id,
      message: `${receiver.name || receiver.email} has confirmed your connection request.`,
      createdAt: new Date(),
    });

    receiver.notifications = receiver.notifications.filter(
      (notification) => notification.sender.toString() !== senderId
    );

    await receiver.save();
    await sender.save();
    res.status(200).json({ message: "Connection confirmed successfully." });
  } catch (error) {
    console.error("Error confirming connection:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


const ignoreConnection = async (req, res) => {
  try {
    const senderId = req.params.id;
    const receiverId = req.user.id;
    const receiver = await User.findById(receiverId);
    if (!receiver)
      return res.status(404).json({ message: "User not found" });

    receiver.notifications = receiver.notifications.filter(
      (notification) => notification.sender.toString() !== senderId
    );

    await receiver.save();
    res.status(200).json({ message: "Notification ignored successfully." });
  } catch (error) {
    console.error("Error ignoring connection:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


const getNotifications = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select("notifications");
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ notifications: currentUser.notifications });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("connections", "-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const getMessages = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select("notifications");
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    const messages = currentUser.notifications
      .filter((notification) => notification.type === "message")
      .map((notification) => notification.message);

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};


const cancelConnectionRequest = async (req, res) => {
  try {
    const receiver = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!receiver) return res.status(404).json({ message: "User not found" });

    receiver.notifications = receiver.notifications.filter(
      (notification) => notification.sender.toString() !== currentUser._id.toString()
    );

    await receiver.save();
    res.status(200).json({ message: "Connection request canceled successfully." });
  } catch (err) {
    console.error("Error canceling connection request:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const disconnectUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    if (!targetUser)
      return res.status(404).json({ message: "User not found" });

    currentUser.connections = currentUser.connections.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    await currentUser.save();

    targetUser.connections = targetUser.connections.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await targetUser.save();
    res.status(200).json({ message: "User disconnected successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getRecommendations, getUserProfile, connectUser, confirmConnection, ignoreConnection, getConnections, getNotifications, getMessages, cancelConnectionRequest, disconnectUser, getChatHistory, getChatNotifications };
