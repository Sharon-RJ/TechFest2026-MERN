const express = require("express");
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

// 2. CORS configuration
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

// 3. CSRF protection
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

  if (
    origin &&
    isStateChangingMethod &&
    req.get("X-Requested-With") !== "XMLHttpRequest"
  ) {
    return res.status(403).json({
      success: false,
      message: "Request blocked: CSRF validation failed."
    });
  }

  next();
});

// 4. Parse incoming request data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Read cookies
app.use(cookieParser());

// 6. Prevent NoSQL injection
app.use(mongoSanitize());

// 7. Request logger
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

module.exports = app;