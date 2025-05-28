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
const Note = require('../models/note');

router.route('/')
  .get(isLoggedIn, catchAsync(courses.index))
  .post(isLoggedIn, upload.array('image'), validateCourse, catchAsync(courses.createCourse))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("Work");
// })

router.get('/new', isLoggedIn, courses.renderNewForm)

router.route('/:id')
  .get(isLoggedIn, catchAsync(courses.showCourses))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCourse, catchAsync(courses.updateCourse))
  .delete(isLoggedIn, catchAsync(courses.deleteCourse))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(courses.renderEditForm))
router.post('/:courseId/progress', isLoggedIn, catchAsync(courses.updateProgress));
router.post('/:courseId/notes', isLoggedIn, catchAsync(courses.saveNote));

module.exports = router;