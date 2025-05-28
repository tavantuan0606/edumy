const Course = require('../models/course');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    });
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    course.reviews.push(review);
    await course.save();
    res.redirect(`/explore/${course._id}/preview`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/explore/${id}/preview`);
};
