const asyncHandler = require("express-async-handler");
const moment = require("moment");
const Booking = require("../models/bookingModel");

// Add a new booking
const addBooking = asyncHandler(async (req, res) => {
  const {
    date,
    numOfAdults,
    name,
    email,
    phoneNumber,
    pickupLocation,
    message,
  } = req.body;

  console.log("Received date:", date);
  const parsedDate = moment(date, "DD-MM-YYYY", true);

  const createdBooking = await Booking.create({
    date: parsedDate.toDate(),
    numOfAdults,
    name,
    email,
    phoneNumber,
    pickupLocation,
    message,
  });

  res.status(201).json(createdBooking);
});

// Get a booking by ID
const getBookingByID = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }
  res.json(booking);
});

// Get all bookings
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find();

  res.json(bookings);
});

module.exports = { addBooking, getBookingByID, getAllBookings };
