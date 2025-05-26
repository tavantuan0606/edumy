const express = require('express');
const router = express.Router();
const courses = require('../controllers/courses');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCourse } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const Progress = require('../models/progress');
const mongoose = require('mongoose');

router.route('/')
    .get(catchAsync(courses.index))
    .post(isLoggedIn, upload.array('image'), validateCourse, catchAsync(courses.createCourse))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("Work");
// })

router.get('/new', isLoggedIn, courses.renderNewForm)

router.route('/:id')
    .get(isLoggedIn,catchAsync(courses.showCourses))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCourse, catchAsync(courses.updateCourse))
    .delete(isLoggedIn, catchAsync(courses.deleteCourse))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(courses.renderEditForm))
router.post('/:courseId/progress', isLoggedIn, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { video, completed } = req.body;
    const userId = req.user._id;

    // console.log('[✔️ API BODY]', req.body);

    if (!video || typeof video !== 'string') {
      throw new Error('Thiếu hoặc sai định dạng video URL');
    }

    const videoLink = video.split('?')[0]; // chuẩn hóa
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    let progress = await Progress.findOne({ user: userId, course: courseObjectId });
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseObjectId,
        completedVideos: []
      });
    }

    const alreadyExists = progress.completedVideos.some(v => v.split('?')[0] === videoLink);

    if (completed === true || completed === 'true') {
      if (!alreadyExists) {
        progress.completedVideos.push(videoLink);
      }
    } else {
      progress.completedVideos = progress.completedVideos.filter(v => v.split('?')[0] !== videoLink);
    }

    await progress.save();
    res.json({ success: true });

  } catch (err) {
    console.error('[❌ Lỗi khi lưu progress]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;