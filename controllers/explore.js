const Course = require('../models/course');
const User = require('../models/user');

module.exports.showExplore = async (req, res) => {
    const allCourses = await Course.find({});
    const user = await User.findById(req.user._id);
    const enrolled = user.enrolledCourses || [];
    const unjoinedCourses = allCourses.filter(course =>
        !enrolled.some(id => id.equals(course._id))
    );
    res.render('courses/explore', { unjoinedCourses });
};

module.exports.previewCourse = async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        });
    if (!course) return res.redirect('/explore');
    res.render('courses/preview', { course });
};

module.exports.enrollCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        await user.save();
    }
    req.flash('success', 'Successfully enrolled!');
    res.redirect('/courses');
};
