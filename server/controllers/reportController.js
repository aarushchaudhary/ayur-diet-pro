const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const Food = require('../models/Food');
const Recipe = require('../models/Recipe');
const DietChart = require('../models/DietChart');
const CryptoJS = require('crypto-js');

// --- Helper Functions ---
const decrypt = (ciphertext) => {
    if (!ciphertext) return null;
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) { return ciphertext; }
};

// --- Controller Functions ---

// @desc    Get aggregated patient and general usage statistics
// @route   GET /api/reports/summary
const getSummary = asyncHandler(async (req, res) => {
    const patients = await Patient.find({ user: req.user.id });
    const recipes = await Recipe.find({ user: req.user.id });
    const dietCharts = await DietChart.find({ user: req.user.id });

    // --- Patient Metrics ---
    const decryptedPatients = patients.map(p => {
        const plain = p.toObject();
        plain.gender = decrypt(p.gender);
        plain.activityLevel = decrypt(p.activityLevel);
        return plain;
    });
    const genderDistribution = decryptedPatients.reduce((acc, p) => {
        const gender = p.gender || 'Unknown';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {});
    const activityLevelDistribution = decryptedPatients.reduce((acc, p) => {
        const level = p.activityLevel || 'Unknown';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    // --- Food & Diet Chart Metrics ---
    let totalCalories = 0;
    const foodUsage = {};

    dietCharts.forEach(chart => {
        chart.meals.forEach(meal => {
            // This is a simplified example. A real-world scenario would involve
            // looking up each food item by its ID to get its calorie count.
            // For now, we'll simulate with a static value.
            totalCalories += 1800; // Assuming an average of 1800 kcal per day in a chart

            // Track food usage (also simplified for this example)
            const foods = [meal.breakfast, meal.lunch, meal.dinner];
            foods.forEach(foodName => {
                if (foodName) {
                    foodUsage[foodName] = (foodUsage[foodName] || 0) + 1;
                }
            });
        });
    });

    const averageCalories = dietCharts.length > 0 ? (totalCalories / (dietCharts.length * 7)).toFixed(0) : 0;

    // Get top 5 most used foods
    const topFoods = Object.entries(foodUsage)
        .sort(([,a],[,b]) => b-a)
        .slice(0, 5)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});


    res.status(200).json({
        totalPatients: patients.length,
        totalRecipes: recipes.length,
        totalDietCharts: dietCharts.length,
        genderDistribution,
        activityLevelDistribution,
        averageCalories,
        topFoods,
    });
});

module.exports = {
    getSummary,
};