import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import foodService from '../services/foodService';

// --- A Detailed Modal Form for the New Food Model ---
const FoodFormModal = ({ food, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    kcal: '',
    servingSize: '100',
    unit: 'g',
    carbs: '0',
    protein: '0',
    fat: '0',
    fiber: '0',
    rasa: '',
    property: '',
    tags: '',
    category: '',
  });

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || '',
        kcal: food.kcal || '',
        servingSize: food.servingSize || '100',
        unit: food.unit || 'g',
        carbs: food.macroNutrients?.carbs || '0',
        protein: food.macroNutrients?.protein || '0',
        fat: food.macroNutrients?.fat || '0',
        fiber: food.macroNutrients?.fiber || '0',
        rasa: food.rasa || '',
        property: food.property || '',
        tags: food.tags ? food.tags.join(', ') : '',
        category: food.category || '',
      });
    }
  }, [food]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Structure the data to match the backend model
    const dataToSave = {
      name: formData.name,
      kcal: formData.kcal,
      servingSize: formData.servingSize,
      unit: formData.unit,
      macroNutrients: {
        carbs: formData.carbs,
        protein: formData.protein,
        fat: formData.fat,
        fiber: formData.fiber,
      },
      rasa: formData.rasa,
      property: formData.property,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category: formData.category,
    };
    onSave(dataToSave);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <h2>{food ? 'Edit Food' : 'Add New Food'}</h2>
        <form onSubmit={handleSubmit} className="patient-form">
          <h4>Core Info</h4>
          <div className="form-grid">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name (e.g., Jowar Roti)" required />
            <input name="kcal" value={formData.kcal} onChange={handleChange} placeholder="Kcal" type="number" required />
            <input name="servingSize" value={formData.servingSize} onChange={handleChange} placeholder="Serving Size" type="number" />
            <input name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit (e.g., g, ml, cup)" />
          </div>

          <h4>Macronutrients (per serving)</h4>
          <div className="form-grid">
            <input name="carbs" value={formData.carbs} onChange={handleChange} placeholder="Carbs (g)" type="number" />
            <input name="protein" value={formData.protein} onChange={handleChange} placeholder="Protein (g)" type="number" />
            <input name="fat" value={formData.fat} onChange={handleChange} placeholder="Fat (g)" type="number" />
            <input name="fiber" value={formData.fiber} onChange={handleChange} placeholder="Fiber (g)" type="number" />
          </div>

          <h4>Ayurvedic Properties & Tags</h4>
          <div className="form-grid">
            <input name="rasa" value={formData.rasa} onChange={handleChange} placeholder="Rasa (e.g., Sweet)" />
            <input name="property" value={formData.property} onChange={handleChange} placeholder="Property (e.g., Warm)" />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Indian)" />
            <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Save Food</button>
            <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};


function FoodsPage() {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const loadFoods = async () => {
    try {
      const response = await foodService.getFoods();
      setFoods(response.data);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const handleSave = async (foodData) => {
    try {
      if (editingFood) {
        await foodService.updateFood(editingFood._id, foodData);
      } else {
        await foodService.createFood(foodData);
      }
      loadFoods();
    } catch (error) {
      console.error("Failed to save food:", error);
    } finally {
      setIsModalOpen(false);
      setEditingFood(null);
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await foodService.deleteFood(id);
        loadFoods();
      } catch (error) {
        console.error("Failed to delete food:", error);
      }
    }
  };

  return (
    <div id="app-view" style={{display: 'block'}}>
      <Header />
      <main className="dashboard-container">
        <div className="table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Food Database</h1>
            <button onClick={() => { setEditingFood(null); setIsModalOpen(true); }}>Add New Food</button>
          </div>

          {isLoading ? (
            <p>Loading foods...</p>
          ) : (
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Kcal</th>
                  <th>Carbs (g)</th>
                  <th>Protein (g)</th>
                  <th>Fat (g)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.length > 0 ? foods.map(f => (
                  <tr key={f._id}>
                    <td>{f.name}</td>
                    <td>{f.kcal}</td>
                    <td>{f.macroNutrients?.carbs || 'N/A'}</td>
                    <td>{f.macroNutrients?.protein || 'N/A'}</td>
                    <td>{f.macroNutrients?.fat || 'N/A'}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(f)} className="btn-ghost">Edit</button>
                      <button onClick={() => handleDelete(f._id)} className="btn-ghost btn-delete">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No foods found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {isModalOpen && (
        <FoodFormModal
          food={editingFood}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingFood(null); }}
        />
      )}

      <Footer />
    </div>
  );
}

export default FoodsPage;