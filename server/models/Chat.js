const mongoose = require("mongoose");
const chatSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Chat", chatSchema);