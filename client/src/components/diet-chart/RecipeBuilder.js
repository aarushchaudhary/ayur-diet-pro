import React from 'react';

function RecipeBuilder() {
  return (
    <div className="panel" style={{ marginTop: '14px' }}>
      <h2>Recipe Builder (simple)</h2>
      <p className="small">Combine multiple foods into a recipe and auto-calc totals.</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <select id="recipeSelect">
            <option>Kitchari Bowl</option>
            <option>Light Lunch</option>
        </select>
        <input id="recipeServings" type="number" defaultValue="1" min="1" style={{ width: '90px' }} />
        <button>Insert into Chart</button>
      </div>
      <div id="recipePreview" style={{ marginTop: '10px', fontSize: '13px', color: 'var(--muted)' }}></div>
    </div>
  );
}

export default RecipeBuilder;