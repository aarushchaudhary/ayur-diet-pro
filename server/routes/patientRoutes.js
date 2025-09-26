const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatient, // 1. Import the new function
  addPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPatients)
  .post(protect, addPatient);

router.route('/:id')
  .get(protect, getPatient) // 2. Add this .get() method
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;