
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    registrationDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent the same user from registering
// for the same event more than once.
registrationSchema.index(
  { user: 1, event: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Registration",
  registrationSchema
);
