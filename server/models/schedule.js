const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  therapist_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Therapist', 
    required: true 
  },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  schedule: { type: String, required: true } // Add the 'schedule' field
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;