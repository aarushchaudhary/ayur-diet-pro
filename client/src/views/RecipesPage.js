import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import recipeService from '../services/recipeService';
import foodService from '../services/foodService'; // To select ingredients

// --- A Reusable Modal for the Recipe Form ---
const RecipeFormModal = ({ recipe, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([{ food: '', quantity: '', unit: 'g' }]);
  const [foodList, setFoodList] = useState([]); // For the ingredient dropdown

  // Load all available foods for the ingredients dropdown
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await foodService.getFoods();
        setFoodList(response.data);
      } catch (error) {
        console.error("Failed to fetch food list", error);
      }
    };
    fetchFoods();
  }, []);

  // Populate form if we are editing an existing recipe
  useEffect(() => {
    if (recipe) {
      setName(recipe.name || '');
      setInstructions(recipe.instructions || '');
      // Ensure ingredients are in the correct format for the form
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        setIngredients(recipe.ingredients.map(ing => ({
            food: ing.food._id || ing.food, // Handle populated vs unpopulated ID
            quantity: ing.quantity,
            unit: ing.unit,
        })));
      }
    }
  }, [recipe]);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { food: '', quantity: '', unit: 'g' }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, instructions, ingredients });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{maxWidth: '700px'}}>
        <h2>{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
        <form onSubmit={handleSubmit} className="patient-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Recipe Name" required />
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions" rows="5" required></textarea>

          <h4>Ingredients</h4>
          {ingredients.map((ing, index) => (
            <div key={index} className="ingredient-row">
              <select value={ing.food} onChange={(e) => handleIngredientChange(index, 'food', e.target.value)} required>
                <option value="">-- Select Food --</option>
                {foodList.map(food => <option key={food._id} value={food._id}>{food.name}</option>)}
              </select>
              <input value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} placeholder="Qty" type="number" required />
              <input value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} placeholder="Unit" required />
              <button type="button" onClick={() => removeIngredient(index)} className="btn-ghost btn-delete">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="btn-ghost" style={{alignSelf: 'flex-start'}}>+ Add Ingredient</button>

          <div className="form-actions">
            <button type="submit" className="btn-save">Save Recipe</button>
            <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const loadRecipes = async () => {
    try {
      const response = await recipeService.getRecipes();
      setRecipes(response.data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleSave = async (recipeData) => {
    // --- START of ADDED CODE ---
    // Filter out any ingredients that don't have a food selected
    const validIngredients = recipeData.ingredients.filter(
      (ing) => ing.food && ing.quantity && ing.unit
    );

    if (validIngredients.length === 0) {
      alert('Please add at least one complete ingredient.');
      return; // Stop the function if no valid ingredients are present
    }

    const dataToSend = { ...recipeData, ingredients: validIngredients };
    // --- END of ADDED CODE ---

    try {
      if (editingRecipe) {
        // Pass the cleaned data to the service
        await recipeService.updateRecipe(editingRecipe._id, dataToSend);
      } else {
        // Pass the cleaned data to the service
        await recipeService.createRecipe(dataToSend);
      }
      loadRecipes(); // Refresh the list
    } catch (error) {
      console.error("Failed to save recipe:", error);
      // Display the actual error from the backend for easier debugging
      alert(`Failed to save recipe: ${error.response?.data?.message || 'Unknown error'}`);
    } finally {
      setIsModalOpen(false);
      setEditingRecipe(null);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeService.deleteRecipe(id);
        loadRecipes();
      } catch (error) {
        console.error("Failed to delete recipe:", error);
      }
    }
  };

  return (
    <div id="app-view" style={{display: 'block'}}>
      <Header />
      <main className="dashboard-container">
        <div className="table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Recipes</h1>
            <button onClick={() => { setEditingRecipe(null); setIsModalOpen(true); }}>Add New Recipe</button>
          </div>

          {isLoading ? (
            <p>Loading recipes...</p>
          ) : (
            <div className="recipe-list">
              {recipes.length > 0 ? recipes.map(r => (
                <div key={r._id} className="recipe-card">
                  <h3>{r.name}</h3>
                  <p className="recipe-category">{r.category || 'General'}</p>
                  <p className="recipe-instructions">{r.instructions.substring(0, 100)}...</p>
                  <h5>Ingredients:</h5>
                  <ul>
                    {r.ingredients.map((ing, i) => (
                      <li key={i}>{ing.food.name} - {ing.quantity}{ing.unit}</li>
                    ))}
                  </ul>
                  <div className="actions-cell">
                    <button onClick={() => handleEdit(r)} className="btn-ghost">Edit</button>
                    <button onClick={() => handleDelete(r._id)} className="btn-ghost btn-delete">Delete</button>
                  </div>
                </div>
              )) : (
                <p style={{ textAlign: 'center' }}>No recipes found. Click "Add New Recipe" to create one!</p>
              )}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <RecipeFormModal
          recipe={editingRecipe}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingRecipe(null); }}
        />
      )}

      <Footer />
    </div>
  );
}

export default RecipesPage;