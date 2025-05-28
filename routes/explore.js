const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const explore = require('../controllers/explore');

router.get('/', isLoggedIn, catchAsync(explore.showExplore));
router.get('/:id/preview', isLoggedIn, catchAsync(explore.previewCourse));
router.post('/:id/enroll', isLoggedIn, catchAsync(explore.enrollCourse));

module.exports = router;
