const { protect, adminOnly } = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");

const router = express.Router();

// GET: Retrieve all events
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// GET: Retrieve one event by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid event ID"
    });
  }

  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// POST: Create a new event
router.post("/", protect, adminOnly, async (req, res) => {
  const { name, category, fee, seats, date } = req.body;

  if (
    !name ||
    !category ||
    fee === undefined ||
    seats === undefined ||
    !date
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all event details"
    });
  }

  const event = await Event.create({
    name,
    category,
    fee,
    seats,
    date
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event
  });
});

// PUT: Update an existing event
router.put("/:id", protect, adminOnly, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid event ID"
    });
  }

  const allowedFields = [
    "name",
    "category",
    "fee",
    "seats",
    "date"
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid fields provided for update"
    });
  }

  const event = await Event.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true
    }
  );

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: event
  });
});

// DELETE: Remove an event
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid event ID"
    });
  }

  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Event deleted successfully"
  });
});

module.exports = router;
