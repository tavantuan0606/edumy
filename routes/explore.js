// explore.js (router)
const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');

// GET /explore - hiển thị khóa học chưa đăng ký
router.get('/', isLoggedIn, async (req, res) => {
    const allCourses = await Course.find({});
    const user = await User.findById(req.user._id);
    const enrolled = user.enrolledCourses || [];
    const unjoinedCourses = allCourses.filter(course =>
        !enrolled.some(id => id.equals(course._id))
    );
    res.render('courses/explore', { unjoinedCourses });
});

// GET /explore/:id/preview - xem chi tiết khóa học
router.get('/:id/preview', isLoggedIn, async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        });
    if (!course) return res.redirect('/explore');
    res.render('courses/preview', { course });
});

// POST /explore/:id/enroll - đăng ký khóa học
router.post('/:id/enroll', isLoggedIn, async (req, res) => {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        await user.save();
    }
    req.flash('success', 'successfully enroll!')
    res.redirect('/courses');
});

module.exports = router;
