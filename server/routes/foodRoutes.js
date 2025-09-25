const express = require('express');
const router = express.Router();
const {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

// Routes for getting all foods and adding a new one
router.route('/')
  .get(protect, getFoods)
  .post(protect, addFood);

// Routes for updating and deleting a specific food by ID
router.route('/:id')
  .put(protect, updateFood)
  .delete(protect, deleteFood);

module.exports = router;