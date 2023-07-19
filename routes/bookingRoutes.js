const express = require("express");
const router = express.Router();
const {
  addBooking,
  getBookingByID,
  getAllBookings,
} = require("../controllers/bookingController");

router.post("/add", addBooking);
router.get("/getOne/:id", getBookingByID);
router.get("/getAll", getAllBookings);

module.exports = router;
