import React from 'react';
import { calculateAge } from '../../utils/dateUtils';

function PatientTable({ patients }) {
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
        {patients && patients.length > 0 ? (
          patients.map((p, index) => (
            <tr key={p._id || index}> {/* Use a unique key like _id from MongoDB */}
              <td>{p.name}</td>
              <td>{p.abhaId || 'N/A'}</td>
              <td>{calculateAge(p.dob) || 'N/A'}</td>
              <td>{p.gender}</td>
              <td>{p.dietaryHabits || 'N/A'}</td>
              {/* Format the date for better readability */}
              <td>{p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'N/A'}</td>
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