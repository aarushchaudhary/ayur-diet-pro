import React from 'react';
import { Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// This component calculates and displays the charts
function ChartVisualizations({ chart }) {
  // --- Data Calculation ---
  // Note: This is a simplified calculation. A more advanced version would
  // involve looking up each food item's detailed properties from a database.
  const allMeals = chart?.meals || [];
  
  // Simplified Macronutrient Calculation
  const macros = allMeals.reduce((acc, meal) => {
    acc.protein += (meal.breakfast?.length + meal.lunch?.length + meal.dinner?.length) * 5; // Assuming avg 5g protein
    acc.carbs += (meal.breakfast?.length + meal.lunch?.length + meal.dinner?.length) * 15; // Assuming avg 15g carbs
    acc.fat += (meal.breakfast?.length + meal.lunch?.length + meal.dinner?.length) * 3; // Assuming avg 3g fat
    return acc;
  }, { protein: 0, carbs: 0, fat: 0 });

  // Simplified Rasa (Taste) Calculation
  const rasas = allMeals.reduce((acc, meal) => {
    acc.sweet += (meal.breakfast?.length || 0) * 2;
    acc.sour += (meal.lunch?.length || 0) * 0.5;
    acc.salty += (meal.dinner?.length || 0) * 0.8;
    acc.pungent += (meal.lunch?.length || 0) * 0.3;
    acc.bitter += (meal.dinner?.length || 0) * 0.2;
    acc.astringent += (meal.breakfast?.length || 0) * 0.4;
    return acc;
  }, { sweet: 0, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 0 });

  // --- Chart Data and Options ---
  const macroChartData = {
    labels: ['Protein (g)', 'Carbohydrates (g)', 'Fat (g)'],
    datasets: [{
      label: 'Macronutrient Distribution',
      data: [macros.protein, macros.carbs, macros.fat],
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
    }],
  };

  const rasaChartData = {
    labels: ['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'],
    datasets: [{
      label: 'Ayurvedic Rasa (Taste) Balance',
      data: [rasas.sweet, rasas.sour, rasas.salty, rasas.pungent, rasas.bitter, rasas.astringent],
      backgroundColor: 'rgba(43, 138, 120, 0.2)',
      borderColor: 'rgba(43, 138, 120, 1)',
      borderWidth: 2,
    }],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        pointLabels: { font: { size: 12 } },
        ticks: { backdropColor: 'white', color: '#666' },
      },
    },
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="chart-visualizations-container panel">
      <h3>Nutritional Analytics</h3>
      <div className="chart-wrapper">
        <h4>Macronutrient Distribution</h4>
        <Doughnut data={macroChartData} />
      </div>
      <div className="chart-wrapper">
        <h4>Rasa (Taste) Balance</h4>
        <Radar data={rasaChartData} options={radarOptions} />
      </div>
    </div>
  );
}

export default ChartVisualizations;