
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("@exortek/express-mongo-sanitize");

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registrations");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// 1. Security HTTP headers
app.use(helmet());

// 2. CORS configuration for the React frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
// CSRF protection for browser-based state-changing requests
app.use((req, res, next) => {
  const origin = req.get("Origin");

  const isStateChangingMethod = [
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ].includes(req.method);

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: "Request blocked: Invalid origin."
    });
  }

  if (origin && isStateChangingMethod &&
      req.get("X-Requested-With") !== "XMLHttpRequest") {
    return res.status(403).json({
      success: false,
      message: "Request blocked: CSRF validation failed."
    });
  }

  next();
});
// 3. Parse incoming request data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Read cookies
app.use(cookieParser());

// 5. Prevent NoSQL injection
app.use(mongoSanitize());

// 6. Custom request logger
app.use(logger);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TechFest 2026 API is running"
  });
});

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
