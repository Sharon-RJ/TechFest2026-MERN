
const express = require("express");
const mongoose = require("mongoose");

const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST: Register for an event
router.post("/", protect, async (req, res, next) => {
  const { eventId } = req.body;

  if (
    typeof eventId !== "string" ||
    !mongoose.isValidObjectId(eventId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid event ID"
    });
  }

  // Check whether the user has already registered
  const existingRegistration = await Registration.findOne({
    user: req.user._id,
    event: eventId
  });

  if (existingRegistration) {
    return res.status(409).json({
      success: false,
      message: "You have already registered for this event"
    });
  }

  let seatReserved = false;

  try {
    // Atomically reserve one available seat
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        seats: { $gt: 0 }
      },
      {
        $inc: { seats: -1 }
      },
      {
        new: true
      }
    );

    if (!event) {
      const eventExists = await Event.exists({ _id: eventId });

      return res.status(eventExists ? 409 : 404).json({
        success: false,
        message: eventExists
          ? "No seats available for this event"
          : "Event not found"
      });
    }

    seatReserved = true;

    // Create the registration
    const registration = await Registration.create({
      user: req.user._id,
      event: eventId
    });

    res.status(201).json({
      success: true,
      message: "Event registration successful",
      data: registration,
      remainingSeats: event.seats
    });
  } catch (error) {
    // Restore the seat if registration creation fails
    if (seatReserved) {
      await Event.updateOne(
        { _id: eventId },
        { $inc: { seats: 1 } }
      );
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event"
      });
    }

    next(error);
  }
});

// GET: View registrations of the logged-in user
router.get("/my", protect, async (req, res) => {
  const registrations = await Registration.find({
    user: req.user._id
  })
    .populate("event", "name category fee date")
    .sort({ registrationDate: -1 });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations
  });
});

module.exports = router;
