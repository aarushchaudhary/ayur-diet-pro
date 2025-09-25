const express = require('express');
const router = express.Router();
const { getFoods, addFood } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFoods).post(protect, addFood);

module.exports = router;