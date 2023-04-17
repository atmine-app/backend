const router = require('express').Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/jwt');

// @desc    GET logged-in user details
// @route   GET /api/v1/users/me
// @access  Private
router.get('/me', isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  res.status(200).json(req.payload);
})

// @desc    UPDATE user properties
// @route   PUT /api/v1/users
// @access  Private
router.put('/edit', isAuthenticated, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.payload._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ data: updatedUser });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Update user status to inactive
// @route   PUT /api/v1/users/deactivate
// @access  Private
router.put('/deactivate', isAuthenticated, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.payload._id, { status: 'inactive' }, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ data: updatedUser });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;