const router = require('express').Router();
const Property = require('../models/Property');
const Vote = require('../models/Vote');
const { isAuthenticated } = require('../middlewares/jwt');


// @desc    get all properties
// @route   GET /properties
// @access  Public
router.get('/', async (req, res, next) => {
    try {
      const properties = await Property.find().populate("owner");
  
      // Get average ratings for properties
      const avgRatings = await Vote.aggregate([
        {
          $group: {
            _id: "$property",
            averageRating: { $avg: "$averageRating" }
          }
        }
      ]);
  
      // Create a map of propertyId to averageRating
      const ratingMap = new Map(
        avgRatings.map(rating => [rating._id.toString(), rating.averageRating])
      );
  
      // Add averageRating to the properties
      const propertiesWithRatings = properties.map(property => {
        const averageRating = ratingMap.get(property._id.toString()) || 0;
        return { ...property.toObject(), averageRating };
      });
  
      console.log(propertiesWithRatings);
      res.status(200).json(propertiesWithRatings);
    } catch (error) {
      next(error);
    }
  });
  

// @desc    Get one property
// @route   GET /properties/:propertyId
// @access  Public
router.get('/:propertyId', async (req, res, next) => {
    const { propertyId } = req.params;
    console.log(propertyId)
    try {
      const property = await Property.findById(propertyId).populate("owner");
      res.status(200).json(property);
    } catch (error) {
      next(error)
    }
  });

// @desc    Create one property
// @route   POST /property
// @access  Private
router.post('/', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
   try {
        const newProperty = await Property.create({ ...req.body, owner: userId });
        console.log(newProperty)
        res.status(201).json(newProperty);
   } catch (error) {
        next(error);
   }
  });

// @desc    Edit one property
// @route   PUT /properties/:propertyId
// @access  Private
router.put('/:propertyId', isAuthenticated,async (req, res, next) => {
    const { propertyId } = req.params;
    try {
      const response = await Property.findByIdAndUpdate(propertyId, req.body, { new: true });
      res.status(204).json({ message: 'OK' });
    } catch (error) {
      next(error)
    }
  });

 // @desc    Delete one course
// @route   DELETE /properties/:propertyId
// @access  Private
router.delete('/:propertyId',isAuthenticated, async (req, res, next) => {
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
  
// @desc    Get all votes
// @route   GET /properties/:propertyId/votes
// @access  Public
router.get('/:propertyId/votes', async (req, res, next) => {
    const { propertyId } = req.params;
    try {
        const votes = await Vote.find({ property: propertyId });
        res.status(200).json(votes);
    } catch (error) {
        next(error);
    }
});

router.post('/:propertyId/vote', isAuthenticated, async (req, res, next) => {
    const { propertyId } = req.params;
    const { location, cleanliness, communication, valueForMoney, amenities,averageRating } = req.body;
    const userId = req.payload._id; // Get the user ID from the JWT payload
  
    try {
      // Find an existing vote by the user
      let vote = await Vote.findOne({ property: propertyId, user: userId });
  
      // If a vote exists, update it; otherwise, create a new vote
      if (vote) {
        vote.location = location;
        vote.cleanliness = cleanliness;
        vote.communication = communication;
        vote.valueForMoney = valueForMoney;
        vote.amenities = amenities;
        vote.averageRating= averageRating;
        vote = await vote.save();
      } else {
        vote = await Vote.create({
          property: propertyId,
          user: userId,
          location,
          cleanliness,
          communication,
          valueForMoney,
          amenities,
          averageRating
        });
      }
  
      // Return the updated vote object as the response
      res.status(201).json(vote);
    } catch (error) {
      next(error);
    }
  });
  
  
  
  module.exports = router;