import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

// Helper to get the auth token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

// Register user
const register = (userData) => {
  return axios.post(API_URL + "register", userData);
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// --- ADD THIS NEW FUNCTION ---
// Get logged-in user's profile data
const getMe = () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  return axios.get(API_URL + "me", config);
};
// --- END OF NEW FUNCTION ---

const authService = {
  register,
  login,
  logout,
  getMe, // Add the function to the export
};

export default authService;