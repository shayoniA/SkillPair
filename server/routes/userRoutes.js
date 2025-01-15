const express = require("express");
const {
  getRecommendations,
  getUserProfile,
  connectUser,
  confirmConnection,
  ignoreConnection,
  getConnections,
  getNotifications,
  getMessages,
  cancelConnectionRequest,
  disconnectUser,
  getChatHistory,
  getChatNotifications
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/recommendations", protect, getRecommendations);
router.get("/profile/:id", protect, getUserProfile);
router.post("/connect/:id", protect, connectUser);
router.post("/users/confirm/:id", protect, confirmConnection);
router.post("/users/ignore/:id", protect, ignoreConnection);
router.get("/connections", protect, getConnections);
router.get("/users/notifications", protect, getNotifications);
router.get("/users/messages", protect, getMessages);
router.post("/users/cancel-request/:id", protect, cancelConnectionRequest);
router.post("/users/disconnect/:id", protect, disconnectUser);
router.get("/users/chat-history/:userId1/:userId2", protect, getChatHistory);
// router.get("/chatnotifications/:userId", protect, getChatNotifications);

module.exports = router;
