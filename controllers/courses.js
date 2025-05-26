const Course = require('../models/course');
const scanDriveStructure = require('../utils/driveScanner');
const { cloudinary } = require('../cloudinary');
const Progress = require('../models/progress');
module.exports.index = async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses })
}

module.exports.renderNewForm = (req, res) => {
    res.render('courses/new');
}

module.exports.createCourse = async (req, res, next) => {
    const course = new Course(req.body.course);
    course.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    course.author = req.user._id;

    // ✅ Trích xuất folderId từ driveLink
    const driveLink = course.driveLink;
    const match = driveLink.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match) {
        const folderId = match[1];
        try {
            const structure = await scanDriveStructure(folderId);
            course.driveStructure = structure;
        } catch (err) {
            console.error("Lỗi khi quét Google Drive:", err.message);
            req.flash('error', 'Không thể quét nội dung Drive. Vui lòng kiểm tra link!');
        }
    } else {
        req.flash('error', 'Drive link không hợp lệ!');
    }

    await course.save();
    req.flash('success', 'Successfully made a new course!');
    res.redirect(`/courses/${course._id}`);
};

module.exports.showCourses = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');

  let completedVideos = [];
    // console.log('[DEBUG] req.user =', req.user);

  if (req.user) {
    try {
    //   console.log('[USER ID]:', req.user._id);
    //   console.log('[COURSE ID]:', course._id);

      const progress = await Progress.findOne({
        user: req.user._id,
        course: course._id
      });

    //   console.log('[PROGRESS]:', progress);

      if (progress && Array.isArray(progress.completedVideos)) {
        completedVideos = progress.completedVideos;
      }
    } catch (err) {
      console.error('[Lỗi khi load progress]:', err.message);
    }
  }

  res.render('courses/show', { course, completedVideos });
};


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id)
    if (!course) {
        req.flash('error', 'Cannot find that course!');
        return res.redirect('/courses');
    }

    res.render('courses/edit', { course });
}

module.exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    course.images.push(...imgs);
    await course.save()
    req.flash('success', 'Successfully updated course!')
    res.redirect(`/courses/${course._id}`)
}

module.exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted course!')
    res.redirect('/courses');
}