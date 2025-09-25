const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Routes for getting all recipes and creating a new one
router.route('/')
  .get(protect, getRecipes)
  .post(protect, createRecipe);

// Routes for getting, updating, and deleting a specific recipe by ID
router.route('/:id')
  .get(protect, getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;