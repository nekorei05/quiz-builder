const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Route Imports
const authRoutes = require("./routes/authRoutes");

// Middleware Imports
const { protect, authorize } = require("./middleware/authMiddleware");

const app = express();

/*
========================
Global Middleware
========================
*/

// Enable CORS
app.use(cors());

// Parse incoming JSON
app.use(express.json());

/*
========================
Routes
========================
*/

// Auth routes
app.use("/api/auth", authRoutes);

// Protected test route
app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user
  });
});

// Admin-only test route
app.get("/api/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Quiz Builder API is running");
});

/*
========================
Database Connection
========================
*/

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Stop server if DB fails
  });

/*
========================
Server Start
========================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});