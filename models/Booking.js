const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BookingSchema = new Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPrice: { type: Number, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  transactionId: { type: String, required() { return this.status === "accepted" } },
  //total: { type: Number, required() { return this.status === "accepted" } },
},
{
  timestamps: true
});

module.exports = model("Booking", BookingSchema);
