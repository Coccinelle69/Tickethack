const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  destination: String,
  time: String,
  price: String,
  isPaid: Boolean,
});

const Booking = mongoose.model("bookings", BookingSchema);

module.exports = Booking;
