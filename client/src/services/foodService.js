import axios from "axios";

const API_URL = "http://localhost:5000/api/food/";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

// Get all food items
const getFoods = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch food items:", error);
    return []; // Return empty array on error
  }
};

const foodService = {
  getFoods,
};

export default foodService;