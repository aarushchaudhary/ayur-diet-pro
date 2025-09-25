import React, { useState, useEffect } from 'react';

// A reusable component for displaying a meal item
function MealItem({ name, calories }) {
  return (
    <div className="meal-item">
      <div>{name}</div>
      <div>{calories} kcal</div>
    </div>
  );
}

function DietPreview() {
  // State to manage the list of selected foods for the chart
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [totalCals, setTotalCals] = useState(0);

  // State for meals
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);

  // Recalculate everything when selectedFoods changes
  useEffect(() => {
    // Calculate total calories
    const cals = selectedFoods.reduce((sum, food) => sum + food.kcal, 0);
    setTotalCals(cals);

    // Distribute food into meals
    const newBreakfast = [];
    const newLunch = [];
    const newDinner = [];

    selectedFoods.forEach((food, index) => {
      if (index % 3 === 0) {
        newBreakfast.push(food);
      } else if (index % 3 === 1) {
        newLunch.push(food);
      } else {
        newDinner.push(food);
      }
    });

    setBreakfast(newBreakfast);
    setLunch(newLunch);
    setDinner(newDinner);

  }, [selectedFoods]);

  const clearChart = () => {
    setSelectedFoods([]);
  };

  // A mock function to simulate fetching foods and generating a chart
  const autoGenerate = () => {
    // In a real app, you would fetch this from your food service
    const mockFoodDatabase = [
        { name: 'Jowar Roti', kcal: 110 },
        { name: 'Steamed Rice', kcal: 130 },
        { name: 'Mung Dal', kcal: 150 },
        { name: 'Buttermilk', kcal: 40 },
        { name: 'Ghee (1 tsp)', kcal: 45 },
        { name: 'Kitchari', kcal: 320 },
    ];
    // Select 3 random foods
    const randomFoods = mockFoodDatabase.sort(() => 0.5 - Math.random()).slice(0, 3);
    setSelectedFoods(randomFoods);
  };

  return (
    <div className="panel preview">
      <div className="hero">
        <div className="hero-left">
          <h3>Diet Chart Preview</h3>
          <p className="small">A nutritionally summarized diet suggestion.</p>
        </div>
        <div className="stats">
          <div className="stat">
            <strong id="totalCals">{totalCals}</strong>
            <small>kcal/day</small>
          </div>
          <div className="stat">
            <strong id="rasaSummary">—</strong>
            <small>Main Rasa</small>
          </div>
          <div className="stat">
            <strong id="propertySummary">—</strong>
            <small>Property</small>
          </div>
        </div>
      </div>
      <div className="diet-grid" id="dietGrid">
        <div className="diet-card">
          <h4>Breakfast</h4>
          <div id="breakfastList">
            {breakfast.length > 0 ? breakfast.map((food, i) => <MealItem key={i} name={food.name} calories={food.kcal} />) : <p className="small">No items</p>}
          </div>
        </div>
        <div className="diet-card">
          <h4>Lunch</h4>
          <div id="lunchList">
            {lunch.length > 0 ? lunch.map((food, i) => <MealItem key={i} name={food.name} calories={food.kcal} />) : <p className="small">No items</p>}
          </div>
        </div>
        <div className="diet-card">
          <h4>Dinner</h4>
          <div id="dinnerList">
            {dinner.length > 0 ? dinner.map((food, i) => <MealItem key={i} name={food.name} calories={food.kcal} />) : <p className="small">No items</p>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={autoGenerate}>Auto-generate Chart</button>
        <button className="btn-ghost" onClick={clearChart}>Clear</button>
        <button className="btn-ghost">Print Diet Chart</button>
      </div>
    </div>
  );
}

export default DietPreview;