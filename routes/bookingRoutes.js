const express = require("express");
const router = express.Router();
const {
  addBooking,
  getBookingByID,
  getAllBookings,
} = require("../controllers/bookingController");

router.post("/add", addBooking);
router.get("/:id", getBookingByID);
router.get("/", getAllBookings);

module.exports = router;
