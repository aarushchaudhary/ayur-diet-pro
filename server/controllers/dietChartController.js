const asyncHandler = require('express-async-handler');
const DietChart = require('../models/DietChart');
const Patient = require('../models/Patient');

// @desc    Get all diet charts for a specific patient
// @route   GET /api/diet-charts/patient/:patientId
const getDietChartsForPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  
  // FIX: Use .equals() for robust ID comparison
  if (!patient || !patient.user.equals(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to view charts for this patient');
  }

  const dietCharts = await DietChart.find({ patient: req.params.patientId });
  res.status(200).json(dietCharts);
});


// @desc    Get a single diet chart by its ID
// @route   GET /api/diet-charts/:id
const getDietChart = asyncHandler(async (req, res) => {
  // Use .populate() to include the full patient object
  const dietChart = await DietChart.findById(req.params.id).populate('patient');

  if (!dietChart) {
    res.status(404);
    throw new Error('Diet chart not found');
  }

  // FIX: Use .equals() for robust ID comparison
  if (!dietChart.user.equals(req.user._id)) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(dietChart);
});


// @desc    Create a new diet chart
// @route   POST /api/diet-charts
const createDietChart = asyncHandler(async (req, res) => {
  const { patientId, chartData, meals, diagnosis, notes, startDate, endDate, status } = req.body;

  if (!patientId || !chartData) {
    res.status(400);
    throw new Error('A patient ID and chart data are required');
  }

  const patient = await Patient.findById(patientId);
  // FIX: Use .equals() for robust ID comparison
  if (!patient || !patient.user.equals(req.user._id)) {
      res.status(401);
      throw new Error('Not authorized to create a chart for this patient');
  }

  const dietChart = await DietChart.create({
    user: req.user.id,
    patient: patientId,
    chartData,
    meals,
    diagnosis,
    notes,
    startDate,
    endDate,
    status,
  });

  res.status(201).json(dietChart);
});


// @desc    Update a diet chart
// @route   PUT /api/diet-charts/:id
const updateDietChart = asyncHandler(async (req, res) => {
  const dietChart = await DietChart.findById(req.params.id);

  if (!dietChart) {
    res.status(404);
    throw new Error('Diet chart not found');
  }

  // FIX: Use .equals() for robust ID comparison
  if (!dietChart.user.equals(req.user._id)) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedDietChart = await DietChart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedDietChart);
});


// @desc    Delete a diet chart
// @route   DELETE /api/diet-charts/:id
const deleteDietChart = asyncHandler(async (req, res) => {
  const dietChart = await DietChart.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id, // This already correctly checks for ownership
  });

  if (!dietChart) {
    res.status(401);
    throw new Error('Diet chart not found or user not authorized');
  }

  res.status(200).json({ id: req.params.id, message: 'Diet chart removed' });
});


module.exports = {
  getDietChartsForPatient,
  getDietChart,
  createDietChart,
  updateDietChart,
  deleteDietChart,
};