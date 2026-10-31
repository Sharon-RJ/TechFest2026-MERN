
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// POST: User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid input format"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters"
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check whether the user already exists
  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email already registered"
    });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user (role defaults to user)
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
});

// POST: User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user
  const user = await User.findOne({
    email: normalizedEmail
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  // Compare entered password with stored hash
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

  // Generate JWT token
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

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = router;
