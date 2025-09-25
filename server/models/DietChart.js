const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., Monday
  breakfast: { type: String, default: '' },
  lunch: { type: String, default: '' },
  dinner: { type: String, default: '' },
  snacks: { type: String, default: '' },
}, { _id: false });

const DietChartSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  // Structured data for charts (object-based for flexibility)
  chartData: {
    type: Object,
    required: true,
  },

  // Meal Plan (Optional but detailed)
  meals: {
    type: [mealSchema],
    default: [],
  },

  // Additional helpful fields
  diagnosis: {
    type: String,
    default: '',
  },

  notes: {
    type: String,
    default: '',
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
  },

  createdByRole: {
    type: String,
    enum: ['doctor', 'dietician', 'admin'],
    default: 'doctor',
  },

  status: {
    type: String,
    enum: ['draft', 'finalized', 'archived'],
    default: 'draft',
  },

  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Optional: Automatically populate patient info if needed
DietChartSchema.pre(/^find/, function (next) {
  this.populate('patient', 'name dob gender')
      .populate('user', 'name role');
  next();
});

module.exports = mongoose.model('DietChart', DietChartSchema);
