import React, { useState } from 'react';
import patientService from '../../services/patientService';
import { calculateAge, toInputDateFormat } from '../../utils/dateUtils';

function PatientProfile() {
  const [name, setName] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');
  const [mealFrequency, setMealFrequency] = useState('3');
  const [notes, setNotes] = useState('');

  const handleSaveProfile = async () => {
    try {
      const patientData = {
        name,
        abhaId,
        gender,
        dob: dob, // Use the actual date of birth from the form
        dietaryHabits: notes,
        mealFrequency,
      };
      
      await patientService.createPatient(patientData);
      alert('Patient profile saved successfully!');
      resetProfile();
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient profile. Please try again.');
    }
  };

  const resetProfile = () => {
    setName('');
    setAbhaId('');
    setDob('');
    setGender('female');
    setMealFrequency('3');
    setNotes('');
  };

  return (
    <div className="panel controls">
      <h2>Patient Profile</h2>
      <div className="form-row">
        <div style={{ flex: 1 }}>
          <label>Name</label>
          <input
            id="pName"
            type="text"
            placeholder="e.g., Meera Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ width: '150px' }}>
          <label>Date of Birth</label>
          <input
            id="pDob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
          />
        </div>
      </div>
      
      {/* Display calculated age */}
      {dob && (
        <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
          Calculated Age: {calculateAge(dob)} years old
        </div>
      )}
      <div className="form-row">
        <div style={{ flex: 1 }}>
          <label>ABHA ID</label>
          <input
            id="pAbhaId"
            type="text"
            placeholder="e.g., 12-3456-7890-1234"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div style={{ flex: 1 }}>
          <label>Gender</label>
          <select id="pGender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style={{ width: '170px' }}>
          <label>Meal Frequency</label>
          <select id="mealFreq" value={mealFrequency} onChange={(e) => setMealFrequency(e.target.value)}>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Dietary Habits / Notes</label>
        <textarea
          id="pNotes"
          placeholder="veg / non-veg / food allergies / digestion patterns"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={handleSaveProfile}>Save Profile</button>
        <button className="btn-ghost" onClick={resetProfile}>Reset</button>
      </div>
    </div>
  );
}

export default PatientProfile;