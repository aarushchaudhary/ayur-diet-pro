import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService'; // Import the patient service

function PatientTable() {
  const [patients, setPatients] = useState([]); // State to hold the patient data
  const [isLoading, setIsLoading] = useState(true); // State to handle loading status

  useEffect(() => {
    // Fetch patients when the component mounts
    const fetchPatients = async () => {
      setIsLoading(true);
      const data = await patientService.getPatients();
      setPatients(data);
      setIsLoading(false);
    };

    fetchPatients();
  }, []); // The empty array ensures this runs only once

  // Display a loading message while fetching data
  if (isLoading) {
    return <div>Loading patients...</div>;
  }

  return (
    <table className="patient-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>ABHA ID</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Dietary Habits</th>
          <th>Last Visit</th>
        </tr>
      </thead>
      <tbody>
        {/* Check if there are patients to display */}
        {patients.length > 0 ? (
          patients.map((p, index) => (
            <tr key={p._id || index}> {/* Use a unique key like _id from MongoDB */}
              <td>{p.name}</td>
              <td>{p.abhaId || 'N/A'}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.dietaryHabits || 'N/A'}</td>
              {/* Format the date for better readability */}
              <td>{new Date(p.lastVisit).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          // Display a message if no patients are found
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>No patients found. Add one from the Diet Chart page!</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default PatientTable;