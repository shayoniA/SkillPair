const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  expertise: { type: [String], required: true },
  interests: { type: String, required: true },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notifications: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String },
      createdAt: { type: Date, default: Date.now },
      status: { type: String, enum: ["new", "confirmed", "ignored"], default: "new" },
    },
  ],
},
);

module.exports = mongoose.model("User", userSchema);
