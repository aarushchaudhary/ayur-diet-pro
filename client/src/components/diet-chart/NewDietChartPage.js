import React, { useState, useMemo } from 'react';
import { foodDatabase } from '../../mockData'; // In a real app, you'd fetch this

import FoodLibrary from './FoodLibrary';
import PlanEditor from './PlanEditor';
import AnalyticsDashboard from './AnalyticsDashboard';
import '../App.css'; // We'll add some basic styles here

export default function NewDietChartPage() {
  // Central state for the entire diet plan
  const [dietPlan, setDietPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  // Handler to add a food item to a meal
  const handleAddFood = (meal, food) => {
    const newItem = {
      ...food,
      // Add a unique ID for this specific instance in the plan
      instanceId: Date.now() 
    };
    setDietPlan(prevPlan => ({
      ...prevPlan,
      [meal]: [...prevPlan[meal], newItem],
    }));
  };

  // Handler to remove a food item from a meal
  const handleRemoveFood = (meal, instanceId) => {
    setDietPlan(prevPlan => ({
      ...prevPlan,
      [meal]: prevPlan[meal].filter(item => item.instanceId !== instanceId),
    }));
  };

  return (
    <div className="new-diet-chart-page">
      <FoodLibrary 
        foods={foodDatabase} 
        onAddFood={handleAddFood} 
      />
      <PlanEditor 
        plan={dietPlan} 
        onRemoveFood={handleRemoveFood} 
      />
      <AnalyticsDashboard 
        plan={dietPlan} 
      />
    </div>
  );
}