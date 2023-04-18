//this code is not used for now. Future iterations will

const mongoose = require("mongoose");

const BookingAlertSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    alertStatus: {
      type: String,
      required: true,
      enum: ["pending", "sent", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const BookingAlert = mongoose.model("BookingAlert", BookingAlertSchema);

module.exports = BookingAlert;

