const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Stores the creator's ID
    ref: 'user',
    required: true,
  },

  // Basic Info
  name: { type: String, required: true }, // Not encrypted
  // --- All fields below will be stored as encrypted strings ---
  abhaId: { type: String }, // ABHA ID (Ayushman Bharat Health Account ID)
  gender: { type: String, required: true },
  dob: { type: String, required: true },

  // Nutrition & Habits
  dietaryHabits: { type: String },
  mealFrequency: { type: String },
  foodPreferences: { type: [String], default: [] }, // Arrays can be stringified and encrypted
  waterIntake: { type: String },
  bowelMovements: { type: String },

  // Medical
  medicalConditions: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  supplements: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  bloodType: { type: String },

  // Health Metrics
  height: { type: String }, // Stored as encrypted string
  weight: { type: String }, // Stored as encrypted string
  BMI: { type: String },
  waistCircumference: { type: String },

  // Lifestyle
  activityLevel: { type: String },
  sleepPattern: { type: String },
  stressLevel: { type: String },
  smokingStatus: { type: String },
  alcoholIntake: { type: String },

  // Other
  notes: { type: String },
  lastVisit: { type: String },

}, {
  timestamps: true,
});

module.exports = mongoose.model('patient', PatientSchema);