import axios from "axios";

const API_URL = "http://localhost:5000/api/recipes/";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

// Create config object with authorization header
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all recipes for the user
const getRecipes = () => {
  return axios.get(API_URL, getConfig());
};

// Create a new recipe
const createRecipe = (recipeData) => {
  return axios.post(API_URL, recipeData, getConfig());
};

// Update a recipe
const updateRecipe = (id, recipeData) => {
  return axios.put(API_URL + id, recipeData, getConfig());
};

// Delete a recipe
const deleteRecipe = (id) => {
  return axios.delete(API_URL + id, getConfig());
};

const recipeService = {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};

export default recipeService;