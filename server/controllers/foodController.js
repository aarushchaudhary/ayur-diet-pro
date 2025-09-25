const asyncHandler = require('express-async-handler');
const Food = require('../models/Food');

// @desc    Get all foods
// @route   GET /api/food
const getFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({});
  res.status(200).json(foods);
});

// @desc    Add a new food item
// @route   POST /api/food
const addFood = asyncHandler(async (req, res) => {
  const {
    name,
    kcal,
    waterContent,
    glycemicIndex,
    servingSize,
    unit,
    macroNutrients, // This will be an object
    microNutrients, // This will be an object
    category,
    tags,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isHydrating,
    allergens,
    rasa,
    property,
    absorptionEffect,
    seasonality
  } = req.body;

  if (!name || !kcal) {
    res.status(400);
    throw new Error('Please provide at least a name and kcal value');
  }

  const food = await Food.create({
    name,
    kcal,
    waterContent,
    glycemicIndex,
    servingSize,
    unit,
    macroNutrients,
    microNutrients,
    category,
    tags,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isHydrating,
    allergens,
    rasa,
    property,
    absorptionEffect,
    seasonality
  });

  res.status(201).json(food);
});

// @desc    Update a food item
// @route   PUT /api/food/:id
const updateFood = asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (!food) {
        res.status(404);
        throw new Error('Food not found');
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedFood);
});

// @desc    Delete a food item
// @route   DELETE /api/food/:id
const deleteFood = asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (!food) {
        res.status(404);
        throw new Error('Food not found');
    }

    await food.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Food item removed' });
});

module.exports = {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
};