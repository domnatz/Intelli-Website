const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lesson_name: {
    type: String,
    required: true, 
  },
  therapy_type: {
    type: String,
    enum: ['SLP', 'OT'], // Define allowed values
    required: true, 
  },
  lesson_category: {
    type: String,
    required: true, 
  },
  lesson_desc: {
    type: String,
    required: true, 
  },
  lesson_complexity: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;