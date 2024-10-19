const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  self_aware: {
    type: Boolean,
    required: true
  },
  lesson_engagement: {
    type: String,
    required: true
  },
  improvement_state: {
    type: String,
    required: true
  },
  error_frequency: {
    type: String,
    required: true
  },
  progress_quality: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    required: true
  },
  progress_score: {
    type: Number,
    required: true
  },
  report_file: {
    filename: String,
    contentType: String,
    data: Buffer,
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
