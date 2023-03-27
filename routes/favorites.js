const router = require('express').Router();
const Favorite = require('../models/Favorite');
const { isAuthenticated } = require('../middlewares/jwt');

// @desc   Add property to favorites
// @route  POST /favorites
// @access Private

router.post('/:propertyId', isAuthenticated, async (req, res, next) => {
    const { propertyId } = req.params;
    const userId = req.payload._id;
    try {
      const newFavorite = await Favorite.create({property: propertyId, user: userId});
      res.status(201).json(newFavorite);
    } catch (error) {
      next(error);
    }
  });
  

// // @desc   Get all favorites
// // @route  GET /favorites
// // @access Private

// router.get('/', isAuthenticated, async (req, res, next) => {
//     try {
//         const favorites = await Favorite.find();
//         res.status(200).json(favorites);
//     } catch (error) {
//         next(error);
//     }
// });

// // @desc   Delete one favorite
// // @route  DELETE /favorites/:favoriteId
// // @access Private

// router.delete('/:favoriteId', isAuthenticated, async (req, res, next) => {
//     const { favoriteId } = req.params;
//     try {
//         const deletedFavorite = await Favorite.findOneAndDelete({ _id: favoriteId });
//         if (deletedFavorite) {
//             res.status(200).json(deletedFavorite);
//         }
//         else {
//             res.status(404).json({ message: 'Favorite not found' });
//         }
//     } catch (error) {
//         next(error);
//     }
// });





module.exports = router;