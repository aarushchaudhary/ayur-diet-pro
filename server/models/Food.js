const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Core nutritional info
  kcal: { type: Number, required: true }, // kcal per serving
  waterContent: { type: Number, default: 0 }, // in grams or percent
  glycemicIndex: { type: Number }, // 0–100
  servingSize: { type: Number, default: 100 }, // in grams or ml
  unit: { type: String, default: 'g' }, // g, ml, cup, tbsp etc.

  // Macronutrients per serving
  macroNutrients: {
    carbs: { type: Number, default: 0 },   // in grams
    protein: { type: Number, default: 0 }, // in grams
    fat: { type: Number, default: 0 },     // in grams
    fiber: { type: Number, default: 0 },   // in grams
  },

  // Micronutrients (optional)
  microNutrients: {
    vitaminA: { type: Number, default: 0 }, // IU or mg
    vitaminC: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
  },

  // Dietary categories & tags
  category: { type: String }, // e.g., Indian, Mediterranean
  tags: { type: [String], default: [] }, // e.g., "low-carb", "fermented"

  // Dietary compatibility
  isVegetarian: { type: Boolean, default: true },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isHydrating: { type: Boolean, default: false }, // For water-rich foods

  // Allergen and food properties
  allergens: { type: [String], default: [] }, // e.g., ["nuts", "soy", "gluten"]
  rasa: { type: String },      // Ayurvedic taste (e.g., Sweet, Bitter)
  property: { type: String },  // e.g., Hot, Cold (Ayurvedic)
  absorptionEffect: { type: String }, // e.g., Quick, Slow
  seasonality: { type: String }, // e.g., Summer, Winter, All-year

  // Metadata
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('food', FoodSchema);
