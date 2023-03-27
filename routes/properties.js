const router = require('express').Router();
const Property = require('../models/Property');


// @desc    Create one property
// @route   POST /property
// @access  Public
router.post('/', async (req, res, next) => {
   try {
        const newProperty = await Property.create(req.body);
        res.status(201).json(newProperty);
   } catch (error) {
        next(error);
   }
  });

  module.exports = router;