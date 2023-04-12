const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const cron = require("node-cron");

const BookingSchema = new Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceFee: { type: Number, required: true},
    bookingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "rejected",
        "cancelled",
        "completed",
      ],
      default: "confirmed",
    },
    transactionId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Add the updateCompletedBookings function as a static method of the Booking model
BookingSchema.statics.updateCompletedBookings = async function () {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Calculate yesterday's date
  const bookings = await this.find({
    endDate: { $lt: yesterday },
    status: { $ne: "completed" },
  });
  bookings.forEach(async (booking) => {
    booking.status = "completed";
    await booking.save();
  });
};

const Booking = model("Booking", BookingSchema);

// Schedule the updateCompletedBookings function to run at 00.01 every day
cron.schedule("1 0 * * *", () => {
  console.log("Running updateCompletedBookings...");
  Booking.updateCompletedBookings();
});

module.exports = Booking;