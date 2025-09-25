import axios from "axios";

const API_URL = "http://localhost:5000/api/diet-charts/";

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

// Create a new diet chart
const createDietChart = (chartData) => {
  return axios.post(API_URL, chartData, getConfig());
};

// Get all diet charts for a specific patient
const getDietChartsForPatient = (patientId) => {
  return axios.get(`${API_URL}patient/${patientId}`, getConfig());
};

// Update a diet chart
const updateDietChart = (id, chartData) => {
  return axios.put(API_URL + id, chartData, getConfig());
};

// Delete a diet chart
const deleteDietChart = (id) => {
  return axios.delete(API_URL + id, getConfig());
};

const dietChartService = {
  createDietChart,
  getDietChartsForPatient,
  updateDietChart,
  deleteDietChart,
};

export default dietChartService;