const express = require('express');
const router = express.Router();
const {
  getDietChartsForPatient,
  createDietChart,
  updateDietChart,
  deleteDietChart,
} = require('../controllers/dietChartController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all charts for a specific patient
router.route('/patient/:patientId').get(protect, getDietChartsForPatient);

// Route to create a new diet chart
router.route('/').post(protect, createDietChart); // Corrected this line

// Routes to update or delete a specific diet chart by its ID
router.route('/:id')
  .put(protect, updateDietChart)
  .delete(protect, deleteDietChart);

module.exports = router;