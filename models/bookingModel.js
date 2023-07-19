const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Please provide the booking date."],
    },
    numOfAdults: {
      type: Number,
      required: [true, "Please provide the number of adults."],
      min: 1,
    },
    name: {
      type: String,
      required: [true, "Please provide your name."],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address."],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide your phone number."],
    },
    pickupLocation: {
      type: String,
      required: [true, "Please provide the pickup location."],
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
