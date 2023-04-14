const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

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
    status: "confirmed",
  }).populate("property").populate("renter");
  
  bookings.forEach(async (booking) => {
    booking.status = "completed";
    await booking.save();
    await this.sendBookingCompletedEmail(booking); // call sendBookingCompletedEmail method on Booking model
  });
};

// Add the sendBookingCompletedEmail function as a static method of the Booking model
BookingSchema.statics.sendBookingCompletedEmail = async function (booking) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  // Populate the `renter` and `property` fields
  const populatedBooking = await Booking.findById(booking._id).populate("renter").populate("property");
  const populatedRenter = populatedBooking.renter;
  const populatedProperty = populatedBooking.property;

  const { startDate, endDate } = booking;

  function formatDate(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const bookingCompletedTemplate = fs.readFileSync(
    path.join(__dirname, "..", "emails", "bookingCompleted.html"),
    "utf-8"
  );

  const html = await ejs.render(bookingCompletedTemplate, {
    property: populatedProperty,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    renter: populatedRenter,
    bookingId: booking._id,
  });

  const message = {
    from: `"atmine" <${process.env.TRANSPORTER_EMAIL}>`,
    to: populatedRenter.email,
    subject: `🎉 Review Your Recent Booking: Share your ${populatedProperty.title} experience`,
    html: html,
  };

  console.log(`Sending email to ${populatedRenter.email}...`);
  return transporter.sendMail(message);
};

const Booking = model("Booking", BookingSchema);


// Schedule the updateCompletedBookings function to run at 10.00am next day after completed
cron.schedule("05 8 * * *", () => {
  try {
    console.log("Running updateCompletedBookings...");
    Booking.updateCompletedBookings();
  } catch (err) {
    console.error("Error running updateCompletedBookings:", err);
  }
});

module.exports = Booking;