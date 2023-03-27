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
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
},
{
  timestamps: true
});

module.exports = model("Booking", BookingSchema);
