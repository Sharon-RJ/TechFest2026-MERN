
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },

    fee: {
      type: Number,
      required: true,
      min: 0
    },

    seats: {
      type: Number,
      required: true,
      min: 0
    },

    date: {
      type: Date,
      required: [true, "Event date is required"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
