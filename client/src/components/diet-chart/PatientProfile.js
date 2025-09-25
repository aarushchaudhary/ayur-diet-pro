import React, { useState } from 'react';

function PatientProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('30');
  const [notes, setNotes] = useState('');

  const handleSaveProfile = () => {
    console.log({ name, age, notes });
    alert('Profile saved!');
  };

  const resetProfile = () => {
    setName('');
    setAge('30');
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
        <div style={{ width: '110px' }}>
          <label>Age</label>
          <input
            id="pAge"
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div style={{ flex: 1 }}>
          <label>Gender</label>
          <select id="pGender">
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>
        <div style={{ width: '170px' }}>
          <label>Meal Frequency</label>
          <select id="mealFreq">
            <option>3</option>
            <option>4</option>
            <option>5</option>
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