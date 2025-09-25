import axios from "axios";

const API_URL = "http://localhost:5000/api/reports/";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get the full summary of all report data
const getSummary = () => {
  return axios.get(`${API_URL}summary`, getConfig());
};

const reportService = {
  getSummary,
};

export default reportService;