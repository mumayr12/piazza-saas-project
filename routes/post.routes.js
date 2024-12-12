const express = require("express");
const Post = require("../models/post.model");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

/**
 * @route   POST /posts
 * @desc    Create a new post
 * @access  Private (Requires authentication)
 */ router.post("/", authenticateToken, async (req, res) => {
  console.log("Authenticated User:", req.user); // Logs the authenticated user
  console.log("Request Body:", req.body); //
  const { title, topic, body, expirationTime } = req.body;
  const { name } = req.user;

  const newPost = new Post({
    title,
    topic,
    body,
    expirationTime,
    owner: name,
  });

  try {
    await newPost.save();
    res.json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ msg: "Error creating post" });
  }
});

/**
 * @route   GET /posts/:topic
 * @desc    Get all posts by topic
 * @access  Public
 */
router.get("/:topic", async (req, res) => {
  try {
    const posts = await Post.find({ topic: req.params.topic });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

/**
 * @route   PUT /posts/:id/action
 * @desc    Perform actions (like, dislike, comment) on a post
 * @access  Private (Requires authentication)
 */
router.put("/:id/action", authenticateToken, async (req, res) => {
  const { action, comment } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ msg: "Post not found" });

  const currentTime = new Date();

  const expirationTime = new Date(post.expirationTime);
  console.log("Current Time:", currentTime);
  console.log("Expiration Time:", expirationTime);

  if (currentTime > expirationTime) {
    return res
      .status(400)
      .json({ msg: "Cannot interact with this post as it has expired." });
  }

  if (action === "like") {
    if (post.owner === req.user.name) {
      return res
        .status(400)
        .json({ msg: "Post owner cannot like their own post." });
    }
    post.likes++;
  } else if (action === "dislike") post.dislikes++;
  else if (action === "comment") {
    post.comments.push({ user: req.user.name, comment, createdAt: new Date() });
  }

  await post.save();
  res.json(post);
});

/**
 * @route   GET /posts/:topic/active-highest-interest
 * @desc    Get the active post with the highest interest by topic
 * @access  Public
 */
router.get("/:topic/active-highest-interest", async (req, res) => {
  try {
    // Find active posts by topic (those not expired)
    const posts = await Post.find({
      topic: req.params.topic,
      expirationTime: { $gt: new Date() }, // Filter posts that are still active
    }).sort({ likes: -1, dislikes: -1 }); // Sort by likes first, then dislikes in descending order

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ msg: "No active posts found for this topic." });
    }

    const highestInterestPost = posts[0]; // The first post in the sorted list has the highest interest

    // Send the response
    res.json({
      post: {
        title: highestInterestPost.title,
        likes: highestInterestPost.likes,
        dislikes: highestInterestPost.dislikes,
      },
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({ error: "Error fetching active highest interest post." });
  }
});

module.exports = router;
