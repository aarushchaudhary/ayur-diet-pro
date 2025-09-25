const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.route('/summary').get(protect, getSummary);

module.exports = router;