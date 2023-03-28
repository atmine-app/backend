const router = require('express').Router();
const Booking = require('../models/Booking');
const { isAuthenticated } = require('../middlewares/jwt');
//Booking + Payment 
const Payment = require('../models/Payment');
const axios = require('axios');
require('dotenv').config();


// @desc    Get one reservation
// @route   GET /reservations/:reservationId
// @access  Private
router.get('/:bookingId',isAuthenticated, async (req, res, next) => {
    const { bookingId } = req.params;
    try {
      const booking = await Booking.findById(bookingId);
      res.status(200).json(booking);
    } catch (error) {
      next(error)
    }
  });

// @desc    Create one property
// @route   POST /property
// @access  Private
/* router.post('/bookings', isAuthenticated,async (req, res, next) => {
  try {
       const newBooking= await Booking.create(req.body);
       res.status(201).json(newBooking);
  } catch (error) {
       next(error);
  }
 }); */

// @desc   Create one booking and process payment
// @route   POST /bookings
// @access  Private
router.post('/bookings', isAuthenticated, async (req, res, next) => {
  try {
    // Create a new booking
    const newBooking = await Booking.create(req.body);
    
    // Get the total amount to charge for the booking
    const { pricePerNight, checkInDate, checkOutDate } = newBooking;
    const daysBooked = (new Date(checkOutDate) - new Date(checkInDate)) / (24 * 60 * 60 * 1000);
    const amount = pricePerNight * daysBooked;

    // Create a payment intent on Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const paymentIntent = await axios.post('https://api.stripe.com/v1/payment_intents', {
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    }, {
      headers: { Authorization: `Bearer ${stripeSecretKey}` }
    });

    // Send the payment confirmation request to Stripe
    const confirmPayment = await axios.post(`https://api.stripe.com/v1/payment_intents/${paymentIntent.data.id}/confirm`, {
      payment_method: 'pm_card_visa', // replace with the actual payment method ID
    }, {
      headers: { Authorization: `Bearer ${stripeSecretKey}` }
    });

    // Create a new payment document in MongoDB
    const payment = new Payment({
      user: req.user.id, // replace with the actual user ID
      amount,
      currency: 'usd',
      paymentIntentId: confirmPayment.data.id,
      status: confirmPayment.data.status,
    });

    await payment.save();

    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
});

 // @desc    Edit one booking
// @route   PUT /bookings/:bookingId
// @access  Private
router.put('/:bookingId',isAuthenticated, async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const response = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });
    console.log(response)
    res.redirect(`/bookings/${bookingId}`)
    res.status(204).json({ message: 'OK' });
  } catch (error) {
    next(error)
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
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  }
  catch (error) {
    next(error);
  }
});
module.exports = router;
