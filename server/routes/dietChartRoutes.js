const express = require('express');
const router = express.Router();
const {
  getDietChartsForPatient,
  createDietChart,
  getDietChart, // 1. Import the new function
  updateDietChart,
  deleteDietChart,
} = require('../controllers/dietChartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/patient/:patientId').get(protect, getDietChartsForPatient);
router.route('/').post(protect, createDietChart);

// Add the .get() method to this route
router.route('/:id')
  .get(protect, getDietChart) // 2. Add this .get() method
  .put(protect, updateDietChart)
  .delete(protect, deleteDietChart);

module.exports = router;