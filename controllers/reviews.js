const Stage = require('../models/course');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const stage = await Stage.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    stage.reviews.push(review);
    await review.save();
    await stage.save();
    res.redirect(`/stages/${stage._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Stage.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete();
    res.redirect(`/stages/${id}`);
}