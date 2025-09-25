const asyncHandler = require('express-async-handler');
const Recipe = require('../models/Recipe');
const Food = require('../models/Food'); // To populate ingredient details

// @desc    Get all recipes for a user
// @route   GET /api/recipes
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ user: req.user.id }).populate('ingredients.food', 'name unit');
  res.status(200).json(recipes);
});

// @desc    Get a single recipe by ID
// @route   GET /api/recipes/:id
const getRecipeById = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('ingredients.food', 'name kcal unit');
    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }
    // Ensure the recipe belongs to the logged-in user
    if (recipe.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    res.status(200).json(recipe);
});

// @desc    Create a new recipe
// @route   POST /api/recipes
const createRecipe = asyncHandler(async (req, res) => {
  const { name, instructions, ingredients, prepTime, cookTime, servings, category, notes } = req.body;

  if (!name || !instructions || !ingredients) {
    res.status(400);
    throw new Error('Please provide a name, instructions, and at least one ingredient');
  }

  const recipe = await Recipe.create({
    user: req.user.id,
    name,
    instructions,
    ingredients,
    prepTime,
    cookTime,
    servings,
    category,
    notes,
  });

  res.status(201).json(recipe);
});

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  // Ensure the recipe belongs to the logged-in user
  if (recipe.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedRecipe);
});

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  if (recipe.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await recipe.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Recipe removed' });
});

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};