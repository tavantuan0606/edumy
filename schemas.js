const Joi = require('Joi');

module.exports.courseSchema = Joi.object({
    course: Joi.object({
        title: Joi.string().required(),
        driveLink: Joi.string().required(),
        description: Joi.string().required(),
        // image: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})