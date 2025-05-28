const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
