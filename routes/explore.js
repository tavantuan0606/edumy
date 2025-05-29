const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const explore = require('../controllers/explore');
const catchAsync = require('../utils/catchAsync');

router.get('/', isLoggedIn, catchAsync(explore.showExplore));
router.get('/:id/preview', isLoggedIn, catchAsync(explore.previewCourse));
router.post('/:id/enroll', isLoggedIn, catchAsync(explore.enrollCourse));

module.exports = router;
