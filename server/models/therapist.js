// models/therapist.js
const mongoose = require('mongoose');

// Therapist Schema
const therapistSchema = new mongoose.Schema({
  therapist_name: { type: String, required: true },
  specialization: { type: String, required: true },
  therapist_gender: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  schedule: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Schedule' 
  }] // Initialize as an empty array
});

const Therapist = mongoose.model('Therapist', therapistSchema);

module.exports = Therapist;