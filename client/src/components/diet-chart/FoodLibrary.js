import React, { useState } from 'react';

export default function FoodLibrary({ foods, onAddFood }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...new Set(foods.map(food => food.category))];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || food.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="column-container">
      <h3>Food & Recipe Library</h3>
      
      {/* Search and Filter Controls */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Food List */}
      <ul className="food-list">
        {filteredFoods.length === 0 ? (
          <li style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No foods found matching your criteria.
          </li>
        ) : (
          filteredFoods.map(food => (
            <li key={food.id}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {food.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {food.kcal} kcal | {food.category} | Virya: {food.virya}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                  Rasa: {food.rasa.join(', ')}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => onAddFood('breakfast', food)}
                  title="Add to Breakfast"
                  style={{ fontSize: '10px' }}
                >
                  B
                </button>
                <button 
                  onClick={() => onAddFood('lunch', food)}
                  title="Add to Lunch"
                  style={{ fontSize: '10px' }}
                >
                  L
                </button>
                <button 
                  onClick={() => onAddFood('dinner', food)}
                  title="Add to Dinner"
                  style={{ fontSize: '10px' }}
                >
                  D
                </button>
                <button 
                  onClick={() => onAddFood('snacks', food)}
                  title="Add to Snacks"
                  style={{ fontSize: '10px' }}
                >
                  S
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Statistics */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div>Total Foods: {foods.length}</div>
        <div>Showing: {filteredFoods.length}</div>
        <div>Categories: {categories.length - 1}</div>
      </div>
    </div>
  );
}