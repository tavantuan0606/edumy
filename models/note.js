const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  sectionIndex: Number,
  content: String
});

noteSchema.index({ user: 1, course: 1, sectionIndex: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
