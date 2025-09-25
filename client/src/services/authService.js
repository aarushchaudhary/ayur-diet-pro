import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

// Register user
const register = (userData) => {
  return axios.post(API_URL + "register", userData);
};

// Login user and store user data (including token) in local storage
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user by removing data from local storage
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;