const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: [String], required: true },
  body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  expirationTime: { type: Date, required: true },
  status: { type: String, default: "Live" },
  owner: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [{ user: String, comment: String, createdAt: Date }],
});

module.exports = mongoose.model("Post", postSchema);
