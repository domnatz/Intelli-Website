// models/user.js
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, required: true },
  contact_number: String, 
  email_address: { type: String, required: true },
  relationship_to_patient: String, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;