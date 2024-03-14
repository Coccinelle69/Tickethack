const mongoose = require("mongoose");

const PurchaseSchema = mongoose.Schema({
  destination: String,
  time: String,
  timeLeft: Number,
  price: Number,
  isPaid: Boolean,
});

const Purchase = mongoose.model("purchases", PurchaseSchema);

module.exports = Purchase;
