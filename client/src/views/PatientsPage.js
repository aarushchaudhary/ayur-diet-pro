import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import patientService from '../services/patientService';
import { calculateAge } from '../utils/dateUtils';

// --- A Detailed Modal Form for the New Patient Model ---
const PatientFormModal = ({ patient, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    abhaId: '',
    gender: 'female',
    dob: '',
    // Nutrition & Habits
    dietaryHabits: '',
    mealFrequency: '',
    foodPreferences: '',
    waterIntake: '',
    bowelMovements: '',
    // Medical
    medicalConditions: '',
    allergies: '',
    // Health Metrics
    height: '',
    weight: '',
    // Lifestyle
    activityLevel: 'sedentary',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        abhaId: patient.abhaId || '',
        gender: patient.gender || 'female',
        dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '',
        dietaryHabits: patient.dietaryHabits || '',
        mealFrequency: patient.mealFrequency || '',
        foodPreferences: Array.isArray(patient.foodPreferences) ? patient.foodPreferences.join(', ') : '',
        waterIntake: patient.waterIntake || '',
        bowelMovements: patient.bowelMovements || '',
        medicalConditions: Array.isArray(patient.medicalConditions) ? patient.medicalConditions.join(', ') : '',
        allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '',
        height: patient.height || '',
        weight: patient.weight || '',
        activityLevel: patient.activityLevel || 'sedentary',
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma-separated strings back to arrays for saving
    const dataToSave = {
      ...formData,
      foodPreferences: formData.foodPreferences.split(',').map(item => item.trim()).filter(Boolean),
      medicalConditions: formData.medicalConditions.split(',').map(item => item.trim()).filter(Boolean),
      allergies: formData.allergies.split(',').map(item => item.trim()).filter(Boolean),
    };
    onSave(dataToSave);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'nutrition':
        return (
          <div className="form-grid">
            <input name="dietaryHabits" value={formData.dietaryHabits} onChange={handleChange} placeholder="Dietary Habits" />
            <input name="mealFrequency" value={formData.mealFrequency} onChange={handleChange} placeholder="Meal Frequency" />
            <input name="waterIntake" value={formData.waterIntake} onChange={handleChange} placeholder="Water Intake (L/day)" />
            <input name="bowelMovements" value={formData.bowelMovements} onChange={handleChange} placeholder="Bowel Movements" />
            <input name="foodPreferences" value={formData.foodPreferences} onChange={handleChange} placeholder="Food Preferences (comma-separated)" className="full-width"/>
          </div>
        );
      case 'medical':
        return (
          <div className="form-grid">
            <input name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="Medical Conditions (comma-separated)" className="full-width"/>
            <input name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Allergies (comma-separated)" className="full-width"/>
          </div>
        );
      case 'metrics':
        return (
          <div className="form-grid">
            <input name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" type="number"/>
            <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" type="number"/>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Active</option>
                <option value="very active">Very Active</option>
            </select>
          </div>
        );
      default: // Basic Info
        return (
          <div className="form-grid">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
            <input name="abhaId" value={formData.abhaId} onChange={handleChange} placeholder="ABHA ID (e.g., 12-3456-7890-1234)" />
            <input name="dob" value={formData.dob} onChange={handleChange} type="date" required />
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{maxWidth: '800px'}}>
        <h2>{patient ? 'Edit Patient' : 'Add New Patient'}</h2>
        <div className="form-tabs">
            <button type="button" className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>Basic Info</button>
            <button type="button" className={activeTab === 'nutrition' ? 'active' : ''} onClick={() => setActiveTab('nutrition')}>Nutrition</button>
            <button type="button" className={activeTab === 'medical' ? 'active' : ''} onClick={() => setActiveTab('medical')}>Medical</button>
            <button type="button" className={activeTab === 'metrics' ? 'active' : ''} onClick={() => setActiveTab('metrics')}>Metrics</button>
        </div>
        <form onSubmit={handleSubmit} className="patient-form">
          {renderTabContent()}
          <div className="form-actions">
            <button type="submit" className="btn-save">Save Patient</button>
            <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};


function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const loadPatients = async () => {
    try {
      const response = await patientService.getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSave = async (patientData) => {
    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient._id, patientData);
      } else {
        await patientService.createPatient(patientData);
      }
      loadPatients();
    } catch (error) {
      console.error("Failed to save patient:", error);
    } finally {
      setIsModalOpen(false);
      setEditingPatient(null);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(id);
        loadPatients();
      } catch (error) {
        console.error("Failed to delete patient:", error);
      }
    }
  };

  return (
    <div id="app-view" style={{display: 'block'}}>
      <Header />
      <main className="dashboard-container">
        <div className="table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Patients</h1>
            <button onClick={() => { setEditingPatient(null); setIsModalOpen(true); }}>Add New Patient</button>
          </div>

          {isLoading ? (
            <p>Loading patients...</p>
          ) : (
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ABHA ID</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>D.O.B</th>
                  <th>Activity Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? patients.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.abhaId || 'N/A'}</td>
                    <td>{p.gender}</td>
                    <td>{calculateAge(p.dob) || 'N/A'}</td>
                    <td>{p.dob ? new Date(p.dob).toLocaleDateString() : 'N/A'}</td>
                    <td>{p.activityLevel || 'N/A'}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(p)} className="btn-ghost">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="btn-ghost btn-delete">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No patients found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {isModalOpen && (
        <PatientFormModal
          patient={editingPatient}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingPatient(null); }}
        />
      )}

      <Footer />
    </div>
  );
}

export default PatientsPage;