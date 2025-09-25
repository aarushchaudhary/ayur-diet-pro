const asyncHandler = require('express-async-handler');
const DietChart = require('../models/DietChart');
const Patient = require('../models/Patient'); // Needed to link charts to patients

// @desc    Get all diet charts for a specific patient
// @route   GET /api/diet-charts/patient/:patientId
const getDietChartsForPatient = asyncHandler(async (req, res) => {
  // Ensure the patient belongs to the logged-in user
  const patient = await Patient.findById(req.params.patientId);
  if (!patient || patient.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to view charts for this patient');
  }

  const dietCharts = await DietChart.find({ patient: req.params.patientId });
  res.status(200).json(dietCharts);
});

// @desc    Create a new diet chart
// @route   POST /api/diet-charts
const createDietChart = asyncHandler(async (req, res) => {
  const { patientId, chartData, meals, diagnosis, notes, startDate, endDate, status } = req.body;

  if (!patientId || !chartData) {
    res.status(400);
    throw new Error('A patient ID and chart data are required');
  }

  // Verify the patient belongs to the logged-in user before creating a chart
  const patient = await Patient.findById(patientId);
  if (!patient || patient.user.toString() !== req.user.id) {
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
    // createdByRole can be enhanced later if you have user roles
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

  // Ensure the chart belongs to the logged-in user
  if (dietChart.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedDietChart = await DietChart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedDietChart);
});

// @desc    Delete a diet chart
// @route   DELETE /api/diet-charts/:id
const deleteDietChart = asyncHandler(async (req, res) => {
  const dietChart = await DietChart.findById(req.params.id);

  if (!dietChart) {
    res.status(404);
    throw new Error('Diet chart not found');
  }

  if (dietChart.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await dietChart.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Diet chart removed' });
});

module.exports = {
  getDietChartsForPatient,
  createDietChart,
  updateDietChart,
  deleteDietChart,
};