const router = require('express').Router();
const Booking = require('../models/Booking');

// @desc    Get one reservation
// @route   GET /reservations/:reservationId
// @access  Private
router.get('/:bookingId', async (req, res, next) => {
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
router.post('/', async (req, res, next) => {
  try {
       const newBooking= await Booking.create(req.body);
       res.status(201).json(newBooking);
  } catch (error) {
       next(error);
  }
 });

module.exports = router;
