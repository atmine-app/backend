const router = require("express").Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middlewares/jwt");

// @desc    GET logged-in user details
// @route   GET /user/me
// @access  Private
router.get("/me", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  res.status(200).json(req.payload);
});

// @desc    UPDATE user details
// @route   PUT /user/edit
// @access  Private
router.put("/edit", isAuthenticated, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: updatedUser });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Update user status to inactive
// @route   PUT /user/deactivate
// @access  Private
router.put("/deactivate", isAuthenticated, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      { status: "inactive" },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: updatedUser });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    GET other user details
// @route   GET /api/chat/:otherUserId
// @access  Private
router.get("/chat/:otherUserId", isAuthenticated, async (req, res, next) => {
  try {
    const otherUser = await User.findById(req.params.otherUserId);
    if (!otherUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: otherUser });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
