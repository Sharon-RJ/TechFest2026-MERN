const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registrations");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow the React frontend to access the backend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ]
  })
);

// Custom request logger
app.use(logger);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TechFest 2026 API is running"
  });
});
// Event API routes
// API routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);

// 404 middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
