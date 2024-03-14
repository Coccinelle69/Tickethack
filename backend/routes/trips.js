var express = require("express");
var router = express.Router();
const Trip = require("../models/trips");
const Booking = require("../models/bookings");
const Purchase = require("../models/purchases");

/* GET users listing. */
router.post("/", async (req, res) => {
  const { departure, arrival, date, currentTime } = req.body;
  if (!departure || !arrival || !date) {
    return res.json({ errorMessage: "Form submission invalid." });
  }
  const transformedDate = new Date(date);
  const transformedCurrentTime = new Date(currentTime);

  // Set the time to midnight (00:00:00) to consider only the date part
  transformedDate.setHours(0, 0, 0, 0);

  console.log(departure, arrival, transformedDate);

  // Search for trips where the date is greater than or equal to the provided date
  // and less than the next day
  const nextDay = new Date(transformedDate);
  nextDay.setDate(transformedDate.getDate() + 1);

  let trips;
  try {
    trips = await Trip.find({
      departure,
      arrival,
      date: {
        $gte: transformedCurrentTime,
        $lt: nextDay,
      },
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong on the server. We are doing our best to fix the problem",
    });
  }

  if (!trips || trips.length === 0) {
    return res.status(404).json({ trips: [] });
  }

  return res.json({ result: true, trips });
});

router.post("/bookings", async (req, res) => {
  const { destination, time, price } = req.body;
  console.log(req.body);
  if (!destination || !time || !price) {
    return res.json({ errorMessage: "Something went wrong." });
  }

  const newBooking = await new Booking({
    destination,
    time,
    price: price,
    isPaid: false,
  });
  try {
    await newBooking.save();
    console.log(newBooking);
    return res.json({
      success: true,
      message: "Cart saved successfully.",
    });
  } catch (error) {
    console.error("Error saving booking:", error);
    return res.status(500).json({ errorMessage: "Failed to save booking." });
  }
});

router.get("/bookings", async (req, res) => {
  let bookings;
  try {
    bookings = await Booking.find();
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong on the server. We are doing our best to fix the problem",
    });
  }

  if (!bookings || bookings.length === 0) {
    return res.status(200).json({ result: false, bookings: [] });
  }

  return res.json({ result: true, bookings });
});

router.delete("/bookings/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  console.log("delete ?");
  try {
    // Assuming `Booking` is your Mongoose model for bookings
    const result = await Booking.deleteOne({ _id: bookingId });

    if (result.deletedCount === 0) {
      // If no bookings were deleted, the booking might not exist
      return res.status(404).json({ message: "Booking not found" });
    }

    // If a booking was deleted successfully
    return res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({ errorMessage: "Failed to delete booking" });
  }
});

router.post("/purchases", async (req, res) => {
  console.log(req.body.purchases);
  const purchases = req.body.purchases;

  for (const purchase of purchases) {
    const price = purchase.price.split("€")[0];
    const timeDate = new Date(`2000-01-01T${purchase.time}:00`).getHours();
    const timeNowDate = new Date(purchase.timeNow).getHours();

    // Calculate the time difference in milliseconds
    let timeDifference = timeDate - timeNowDate;

    if (timeDifference < 0) {
      timeDifference = 0;
    }
    // Convert the time difference to hours
    console.log(timeDifference);
    const newPurchase = await new Purchase({
      destination: purchase.destination,
      time: purchase.time,
      timeLeft: timeDifference,
      price: price,
      isPaid: true,
    });
    await newPurchase.save();
    // console.log(newPurchase);
  }

  await Booking.deleteMany();

  return res.json({
    success: true,
    message: "Purchase saved successfully.",
  });
});

router.get("/purchases", async (req, res) => {
  let purchases;
  try {
    purchases = await Purchase.find();
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong on the server. We are doing our best to fix the problem",
    });
  }

  if (!purchases || purchases.length === 0) {
    return res.status(200).json({ result: false, purchases: [] });
  }

  return res.json({ result: true, purchases });
});

module.exports = router;
