const router = require("express").Router();
const Booking = require("../models/Booking");
const { isAuthenticated } = require("../middlewares/jwt");
const {parseISO,format} = require("date-fns");

//nodemailes and transporter config

const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASSWORD,
  },
});

function formatDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
}

//confirmation email

async function sendConfirmationEmail(booking) {
  const { amount, property, renter, startDate, endDate } = booking;
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const bookingConfirmationTemplate = fs.readFileSync(
    path.join(__dirname, "..", "emails", "bookingConfirmation.html"),
    "utf-8"
  );
  const html = await ejs.render(bookingConfirmationTemplate, {
    amount,
    property,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    renter,
    bookingId: booking._id,
  });

  const message = {
    from: `"atmine" <${process.env.TRANSPORTER_EMAIL}>`,
    to: renter.email,
    subject: `📅 Booking Confirmation for property ${property.title} from ${formattedStartDate} to ${formattedEndDate}`,
    html: html,
  };

  return transporter.sendMail(message);
}

//cancelation email

async function sendCancellationEmail(booking) {
  const { property, renter, startDate, endDate } = booking;
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const bookingCancellationTemplate = fs.readFileSync(
    path.join(__dirname, "..", "emails", "bookingCancellation.html"),
    "utf-8"
  );
  const html = await ejs.render(bookingCancellationTemplate, {
    property,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    renter,
    bookingId: booking._id,
  });

  const message = {
    from: `"atmine" <${process.env.TRANSPORTER_EMAIL}>`,
    to: renter.email,
    subject: `🚫 Booking Cancellation for property ${property.title} from ${formattedStartDate} to ${formattedEndDate}`,
    html: html,
  };

  return transporter.sendMail(message).catch((error) => {
    console.error("Email sending failed:", error);
  });
}

async function populateBooking(bookingId) {
  return Booking.findById(bookingId).populate("property").populate({
    path: "renter",
    model: "User",
    select: "email",
  });
}

// @desc    Get one booking
// @route   GET /bookings/:bookingId
// @access  Private
router.get("/:bookingId", isAuthenticated, async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId)
      .populate("property")
      .populate("renter")
      .populate({
        path: "owner",
        model: "User",
      });
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

// @desc Create one booking
// @route POST /bookings
// @access Private
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newBooking = await Booking.create(req.body);

    // Populate property and renter fields
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("property")
      .populate("renter");

    await sendConfirmationEmail(populatedBooking)
      .then(() => {
        res.status(201).json(newBooking);
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        res.status(500).json({ message: "Email sending failed", error });
      });
  } catch (error) {
    next(error);
  }
});

// @desc    Edit One booking
// @route   PUT /bookings/:bookingId
// @access  Private
router.put("/:bookingId", isAuthenticated, async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const oldBooking = await populateBooking(bookingId);

    if (!oldBooking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      req.body,
      { new: true }
    )
      .populate("property")
      .populate("renter");

    // If booking status has been updated to "cancelled", send cancellation email
    if (
      oldBooking.status !== "cancelled" &&
      updatedBooking.status === "cancelled"
    ) {
      await sendCancellationEmail(updatedBooking).catch((error) => {
        console.error("Email sending failed:", error);
      });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete One booking
// @route   DELETE /bookings/:bookingId
// @access  Private
router.delete("/:bookingId", isAuthenticated, async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId });
    if (deletedBooking) {
      res.status(200).json(deletedBooking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Get All bookings
// @route   GET /bookings
// @access  Private

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("property")
      .populate("renter")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

// @desc    post blocking date
// @route   /block
// @access  Private

router.post("/block", async (req, res) => {
  try {
    const { property, startDate, endDate } = req.body;
    const parsedStartDate = parseISO(startDate);
    const parsedEndDate = parseISO(endDate);
    const formattedStartDate = format(parsedStartDate, "yyyy-MM-dd");
    const formattedEndDate = format(parsedEndDate, "yyyy-MM-dd");

    const bookingData = {
      property: property,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      status: "blocked",
    };
    const booking = await Booking.create(bookingData);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error in block route:", error);
    res.status(500).json({ message: "Error blocking date range", error });
  }
});

module.exports = router;
