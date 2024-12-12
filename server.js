const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

connectDB();

app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Piazza SaaS Application API</h1>
    <p>This is the API for the Piazza SaaS platform, providing powerful features for creating post and commenting on them.</p>
    <p>Key Features:</p>
    <ul>
      <li>User management: Users</li>
      <li>Interactive posts and comments</li>
      <li>Secure authentication and role-based access control</li>
    </ul>
    <p>To explore the API, visit: <a href="/api">/api</a></p>
    <p>For further documentation or support, contact the Piazza developer.</p>
  `);
});

// API root route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API!",
    routes: {
      posts: [
        {
          method: "POST",
          endpoint: "/api/posts",
          description: "Create a new post (requires authentication).",
        },
        {
          method: "GET",
          endpoint: "/api/posts/:topic",
          description: "Get all posts for a specific topic.",
        },
        {
          method: "PUT",
          endpoint: "/api/posts/:id/action",
          description: "Interact with a post (like, dislike, comment).",
        },
        {
          method: "GET",
          endpoint: "/api/posts/:topic/active-highest-interest",
          description:
            "Get the active post with the highest interest for a specific topic.",
        },
      ],
      users: [
        {
          method: "POST",
          endpoint: "/api/users/register",
          description: "Register a new user.",
        },
        {
          method: "POST",
          endpoint: "/api/users/login",
          description: "Log in as a user.",
        },
      ],
    },
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Default route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
