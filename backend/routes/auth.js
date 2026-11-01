const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/"
};

// Return validation errors
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Input validation failed",
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};

// POST: User Registration
router.post(
  "/register",
  [
    body("name")
      .isString()
      .withMessage("Name must be text")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must contain 2 to 50 characters"),

    body("email")
      .isString()
      .withMessage("Email must be text")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),

    body("password")
      .isString()
      .withMessage("Password must be text")
      .isLength({ min: 6, max: 72 })
      .withMessage("Password must contain 6 to 72 characters")
  ],
  checkValidation,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Registration error:", error.message);

      res.status(500).json({
        success: false,
        message: "Registration failed"
      });
    }
  }
);

// POST: User Login
router.post(
  "/login",
  [
    body("email")
      .isString()
      .withMessage("Email must be text")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),

    body("password")
      .isString()
      .withMessage("Password must be text")
      .isLength({ min: 6, max: 72 })
      .withMessage("Password must contain 6 to 72 characters")
  ],
  checkValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      const user = await User.findOne({
        email: normalizedEmail
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
      }

      const token = jwt.sign(
        {
          id: user._id.toString(),
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

      res.cookie("token", token, cookieOptions);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error.message);

      res.status(500).json({
        success: false,
        message: "Login failed"
      });
    }
  }
);

// GET: Verify current logged-in user
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// POST: Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

module.exports = router;