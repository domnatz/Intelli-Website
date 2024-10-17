const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  therapist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: false
  },
  patient_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  appointment_type: { 
    type: String, 
    required: true,
    enum: ['Occupational Therapy', 'Speech Therapy'] // Example enums, adjust as needed
  },
  appointment_status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'] 
  },
  appointment_notes: String,
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;