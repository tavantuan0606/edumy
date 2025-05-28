// routes/course-reviews.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const Course = require('../models/course');
const Review = require('../models/review');
const { isLoggedIn, isAuthor } = require('../middleware');

// POST: tạo review mới cho khóa học
router.post('/', isLoggedIn, async (req, res) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' } // 👈 populate author của mỗi review
    });;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    course.reviews.push(review);
    await course.save();
    res.redirect(`/explore/${course._id}/preview`);
});

// DELETE: xóa review của user
router.delete('/:reviewId', isLoggedIn, isAuthor, async (req, res) => {
    const { id, reviewId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/explore/${id}/preview`);
});

module.exports = router;
