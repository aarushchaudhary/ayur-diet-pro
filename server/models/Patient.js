const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  dietaryHabits: { type: String },
  mealFrequency: { type: Number },
  lastVisit: { type: Date, default: Date.now },
});

module.exports = mongoose.model('patient', PatientSchema);