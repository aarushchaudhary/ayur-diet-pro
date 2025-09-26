import axios from "axios";

const API_URL = "http://localhost:5000/api/patients/";

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

// Create new patient
const createPatient = (patientData) => {
  return axios.post(API_URL, patientData, getConfig());
};

// Get user patients
const getPatients = () => {
  return axios.get(API_URL, getConfig());
};

// Get a single patient by ID
const getPatient = (id) => {
  return axios.get(API_URL + id, getConfig());
};

// Update patient
const updatePatient = (id, patientData) => {
  return axios.put(API_URL + id, patientData, getConfig());
};

// Delete patient
const deletePatient = (id) => {
  return axios.delete(API_URL + id, getConfig());
};

// Get the 5 most recent patients with diet charts
const getRecentPatientsWithCharts = () => {
  return axios.get(`${API_URL}recent-with-charts`, getConfig());
};

const patientService = {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getRecentPatientsWithCharts,
};

export default patientService;