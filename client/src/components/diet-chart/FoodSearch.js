import React, { useState, useEffect } from 'react';
import foodService from '../../services/foodService'; // Import the service

function FoodSearch() {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch food data when the component loads
    const fetchFoods = async () => {
      setIsLoading(true);
      const data = await foodService.getFoods();
      setFoods(data);
      setIsLoading(false);
    };

    fetchFoods();
  }, []);

  const addFood = (foodId) => {
    // This logic would typically update a shared state in the parent component
    console.log(`Added food with ID: ${foodId}`);
    alert('Food added! (See console for ID)');
  };

  return (
    <div className="panel" style={{ marginTop: '14px' }}>
      <h2>Food Quick-Add</h2>
      <p className="small">Search and add foods from the database.</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <input id="foodSearch" type="text" placeholder="Search foods..." />
        <button className="btn-ghost">All</button>
      </div>
      <div id="foodList" className="food-list" style={{ marginTop: '8px' }}>
        {isLoading ? (
          <p>Loading foods...</p>
        ) : foods.length > 0 ? (
          foods.map(f => (
            <div key={f._id} className="food-card">
              <div>
                <div className="food-meta">{f.name}</div>
                <div className="small">{f.rasa || 'N/A'} • {f.property || 'N/A'} • {f.kcal} kcal</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                {f.tags && <div className="badge">{f.tags[0]}</div>}
                <button onClick={() => addFood(f._id)} style={{ background: 'none', border: 0, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Add</button>
              </div>
            </div>
          ))
        ) : (
          <p>No food items found in the database.</p>
        )}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input id="customFoodName" type="text" placeholder="Add custom food (name)" />
        <button>Add</button>
      </div>
    </div>
  );
}

export default FoodSearch;