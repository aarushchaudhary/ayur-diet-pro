const mongoose = require('mongoose');

const DietChartSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    chartData: { type: Object, required: true }, // Store the generated chart
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('dietChart', DietChartSchema);