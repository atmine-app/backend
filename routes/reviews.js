const router = require('express').Router();
const Review = require('../models/Review');
const { isAuthenticated } = require('../middlewares/jwt');


// @desc    Get all reviews from one property
// @route   GET /reviews/:propertyId
// @access  public
router.get('/:propertyId', async (req, res, next) => {
    const { propertyId } = req.params;
    console.log('im inside get reviews backend')
    console.log(propertyId)
    try {
      const reviews = await Review.find({ property: propertyId }).populate('user');
      console.log(reviews)
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  });
  

// @desc    Create one review
// @route   POST /reviews
// @access  Private
router.post('/',isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    const review = req.body.review;
    const propertyId = req.body.propertyId;
    console.log(req.body)
    console.log(review)
    console.log(userId)
    console.log(propertyId)
    try {
        const newReview = await Review.create({review, property: propertyId, user: userId});
        console.log(newReview)
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

// @desc    Edit one review
// @route   PUT /reviews/:reviewId
// @access  Private
router.put('/:reviewId',isAuthenticated, async (req, res, next) => {
    const { reviewId } = req.params;
    try {
        const response = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
        res.redirect(`/reviews/${reviewId}`)
        res.status(204).json({ message: 'OK' });
    } catch (error) {
        next(error)
    }
});

// @desc    Delete one review
// @route   DELETE /reviews/:reviewId
// @access  Private 
router.delete('/:reviewId',isAuthenticated,   async (req, res, next) => {
    const { reviewId } = req.params;
    try {
        const deletedReview = await Review.findOneAndDelete({ _id: reviewId });
        if (deletedReview) {
            res.status(200).json(deletedReview);
        }
        else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        next(error);
    }
});

// @desc    Get all reviews
// @route   GET /reviews
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});


module.exports = router;