const router = require('express').Router();

// @desc    get all properties
// @route   GET /
// @access  Public
router.get('/', async (req, res, next) => {;
 try {
   const properties = await Property.find();
   res.status(200).json(properties);
 }
  catch (error) {
    next(error);
  }
});

module.exports = router;