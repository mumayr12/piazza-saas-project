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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
