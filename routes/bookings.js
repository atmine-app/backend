const router = require('express').Router();
const Booking = require('../models/Booking');
const { isAuthenticated } = require('../middlewares/jwt');

const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASSWORD,
  }
});

// @desc    Get one reservation
// @route   GET /booking/:bookinId
// @access  Private
router.get('/:bookingId',isAuthenticated, async (req, res, next) => {
    const { bookingId } = req.params;
    try {
      const booking = await Booking.findById(bookingId)
        .populate("property")
        .populate("renter")
        .populate({
            path: "owner",
            model: "User"
        });
      res.status(200).json(booking);
    } catch (error) {
      next(error)
    }
  });

// @desc    Create one property
// @route   POST /booking
// @access  Private
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const newBooking = await Booking.create(req.body);

    // Populate property and renter fields
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('property')
      .populate('renter');

    // Add the email sending logic here
    const { amount, property, renter, startDate, endDate } = populatedBooking;

    const bookingConfirmationTemplate = fs.readFileSync(path.join(__dirname, '..', 'emails', 'bookingConfirmation.html'), 'utf-8');
    const html = await ejs.render(bookingConfirmationTemplate, { amount, property, startDate, endDate, renter, bookingId: newBooking._id });

    const message = {
      from: `"atmine" <${process.env.TRANSPORTER_EMAIL}>`,
      to: renter.email,
      subject: `📅 Booking Confirmation for property ${property.title} from ${startDate} to ${endDate}`,
      html: html,
    };

await transporter.sendMail(message).then(info => {
  console.log(`Email sent: ${info.response}`);
  res.status(201).json(newBooking);
}).catch(error => {
  console.error('Email sending failed:', error);
  res.status(500).json({ message: 'Email sending failed', error });
});

  } catch (error) {
    next(error);
  }
});

// @desc    Edit one booking
// @route   PUT /bookings/:bookingId
// @access  Private
router.put('/:bookingId', isAuthenticated, async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const response = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });
    res.status(204).json({ message: 'OK' });
  } catch (error) {
    next(error);
  }
});

 // @desc    Delete one course
// @route   DELETE /courses/:courseId
// @access  Private
router.delete('/:bookingId',isAuthenticated, async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId });
    if (deletedBooking) {
      res.status(200).json(deletedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.log('error:', error);
    next(error);
  }
});

// @desc    get all bookings
// @route   GET /
// @access  Private

router.get('/',isAuthenticated, async (req, res, next) => {;
  try {
    const bookings = await Booking.find().populate("property").sort({ createdAt: -1 });
    res.status(200).json(bookings);
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
