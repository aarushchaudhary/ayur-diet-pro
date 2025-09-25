const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    kcal: { type: Number, required: true },
    rasa: { type: String }, // e.g., Sweet, Sour
    property: { type: String }, // e.g., Hot, Cold
    tags: [String],
    category: { type: String }, // e.g., Indian, International
});

module.exports = mongoose.model('food', FoodSchema);