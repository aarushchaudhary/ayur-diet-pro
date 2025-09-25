const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'food',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    default: 'g',
  },
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  ingredients: {
    type: [ingredientSchema],
    default: [],
  },
  instructions: {
    type: String,
    required: true,
  },
  prepTime: {
    type: Number, // in minutes
  },
  cookTime: {
    type: Number, // in minutes
  },
  servings: {
    type: Number,
  },
  category: {
    type: String, // e.g., Breakfast, Lunch, Dinner
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', RecipeSchema);