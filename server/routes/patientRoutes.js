const express = require('express');
const router = express.Router();
const {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPatients)
  .post(protect, addPatient);

router.route('/:id')
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;