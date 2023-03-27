const router = require('express').Router();
const Review = require('../models/Review');

// @desc    Get one review
// @route   GET /reviews/:reviewId
// @access  public
router.get('/:reviewId', async (req, res, next) => {
    const { reviewId } = req.params;
    try {
        const review = await Review.findById(reviewId);
        res.status(200).json(review);
    } catch (error) {
        next(error)
    } 
});

// @desc    Create one review
// @route   POST /reviews
// @access  Private
router.post('/', async (req, res, next) => {
    try {
        const newReview = await Review.create(req.body);
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

// @desc    Edit one review
// @route   PUT /reviews/:reviewId
// @access  Private
router.put('/:reviewId', async (req, res, next) => {
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
router.delete('/:reviewId', async (req, res, next) => {
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