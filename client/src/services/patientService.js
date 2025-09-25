import axios from "axios";

// The URL for your backend's patient API endpoint
const API_URL = "http://localhost:5000/api/patients/";

// Get the user's token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

/**
 * Fetches the list of patients for the logged-in user.
 * @returns {Promise<Array>} A promise that resolves to an array of patients.
 */
const getPatients = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return []; // Return an empty array on error
  }
};

const patientService = {
  getPatients,
  // You can add createPatient, updatePatient, etc. functions here later
};

export default patientService;