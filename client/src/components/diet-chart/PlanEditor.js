import React from 'react';

export default function PlanEditor({ plan, onRemoveFood, onUpdatePortion }) {
  return (
    <div className="column-container">
      <h3>Daily Diet Plan Editor</h3>
      {Object.entries(plan).map(([meal, items]) => (
        <div key={meal} className="meal-section">
          <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
          {items.length === 0 ? (
            <p>No items added. Use the Food Library to add items.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {items.map(item => (
                <li key={item.instanceId} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '10px', 
                  margin: '5px 0',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {Math.round(item.kcal * (item.portion || 100) / 100)} kcal | 
                      Virya: {item.virya} | 
                      Rasa: {item.rasa.join(', ')}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {onUpdatePortion && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="number"
                          min="10"
                          max="500"
                          value={item.portion || 100}
                          onChange={(e) => onUpdatePortion(meal, item.instanceId, parseInt(e.target.value) || 100)}
                          style={{ width: '60px', padding: '4px', textAlign: 'center', borderRadius: '3px', border: '1px solid #ccc' }}
                        />
                        <span style={{ fontSize: '12px', color: '#666' }}>g</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => onRemoveFood(meal, item.instanceId)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      
      {Object.values(plan).every(meal => meal.length === 0) && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <p style={{ color: '#666' }}>Your diet plan is empty.</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Go to the Food Library tab to start adding foods to meals.
          </p>
        </div>
      )}
    </div>
  );
}