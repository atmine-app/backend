const router = require('express').Router();
const Booking = require('../models/Booking');
const { isAuthenticated } = require('../middlewares/jwt');

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
router.post('/', isAuthenticated,async (req, res, next) => {
  try {
       const newBooking= await Booking.create(req.body);
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
