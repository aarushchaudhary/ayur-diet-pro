const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatient,
  getRecentPatientsWithCharts, // 1. Import the new function
  addPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

// 2. Add the new route
router.route('/recent-with-charts').get(protect, getRecentPatientsWithCharts);

router.route('/')
  .get(protect, getPatients)
  .post(protect, addPatient);

router.route('/:id')
  .get(protect, getPatient)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;