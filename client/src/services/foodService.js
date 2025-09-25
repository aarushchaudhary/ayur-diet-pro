import axios from "axios";

const API_URL = "http://localhost:5000/api/food/";

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

// Get all food items
const getFoods = () => {
  return axios.get(API_URL, getConfig());
};

// Create a new food item
const createFood = (foodData) => {
  return axios.post(API_URL, foodData, getConfig());
};

// Update a food item
const updateFood = (id, foodData) => {
  return axios.put(API_URL + id, foodData, getConfig());
};

// Delete a food item
const deleteFood = (id) => {
  return axios.delete(API_URL + id, getConfig());
};

const foodService = {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
};

export default foodService;