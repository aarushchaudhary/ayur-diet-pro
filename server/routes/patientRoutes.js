const express = require('express');
const router = express.Router();
const { getPatients, addPatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPatients).post(protect, addPatient);

module.exports = router;