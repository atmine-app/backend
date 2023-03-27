const router = require('express').Router();
const Property = require('../models/Property');


// @desc    Get one property
// @route   GET /courses/:propertyId
// @access  Public
router.get('/:propertyId', async (req, res, next) => {
    const { propertyId } = req.params;
    try {
      const property = await Property.findById(propertyId);
      res.status(200).json(property);
    } catch (error) {
      next(error)
    }
  });

// @desc    Create one property
// @route   POST /property
// @access  Private
router.post('/', async (req, res, next) => {
   try {
        const newProperty = await Property.create(req.body);
        res.status(201).json(newProperty);
   } catch (error) {
        next(error);
   }
  });

// @desc    Edit one property
// @route   PUT /properties/:propertyId
// @access  Private
router.put('/:propertyId', async (req, res, next) => {
    const { propertyId } = req.params;
    try {
      const response = await Property.findByIdAndUpdate(propertyId, req.body, { new: true });
      console.log(response)
      res.redirect(`/properties/${propertyId}`)
      res.status(204).json({ message: 'OK' });
    } catch (error) {
      next(error)
    }
  });

 // @desc    Delete one course
// @route   DELETE /courses/:courseId
// @access  Private
router.delete('/:propertyId', async (req, res, next) => {
    const { propertyId } = req.params;
    try {
      const deletedProperty = await Property.findOneAndDelete({ _id: propertyId });
      if (deletedProperty) {
        res.status(200).json(deletedProperty);
      } else {
        res.status(404).json({ message: 'Property not found' });
      }
    } catch (error) {
      next(error);
    }
  });
  

  module.exports = router;