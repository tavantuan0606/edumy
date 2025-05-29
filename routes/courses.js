const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const course = require('../controllers/courses');

router
  .route('/')
  .get(isLoggedIn, catchAsync(course.index))
  .post(isLoggedIn, catchAsync(course.createCourse));

router.get('/new', isLoggedIn, course.renderNewForm);

router
  .route('/:id')
  .get(isLoggedIn, catchAsync(course.showCourses))
  .put(isLoggedIn, catchAsync(course.updateCourse))
  .delete(isLoggedIn, catchAsync(course.deleteCourse));

router.get('/:id/edit', isLoggedIn, catchAsync(course.renderEditForm));

router.post('/:courseId/progress', isLoggedIn, catchAsync(course.updateProgress));
router.post('/:courseId/notes', isLoggedIn, catchAsync(course.saveNote));

module.exports = router;
