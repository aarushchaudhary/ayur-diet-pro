import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import dietChartService from '../services/dietChartService';
import patientService from '../services/patientService'; // To get the list of patients

// --- A Simple Modal for the Diet Chart Form ---
const DietChartFormModal = ({ patientId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    notes: '',
    // Simple meal input for this example
    breakfast: '',
    lunch: '',
    dinner: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Structure the data to match the backend model
    const chartDataToSave = {
      patientId,
      diagnosis: formData.diagnosis,
      notes: formData.notes,
      chartData: {
        summary: "Weekly Diet Plan", // Example flexible data
      },
      meals: [ // Creating a simple 7-day plan with the same meals
        { day: 'Monday', breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner },
        { day: 'Tuesday', breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner },
        { day: 'Wednesday', breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner },
        { day: 'Thursday', breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner },
        { day: 'Friday', breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner },
        { day: 'Saturday', breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner },
        { day: 'Sunday', breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner },
      ]
    };
    onSave(chartDataToSave);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Create New Diet Chart</h2>
        <form onSubmit={handleSubmit} className="patient-form">
          <input name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="Diagnosis (e.g., Vata Imbalance)" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="General Notes for the patient"></textarea>
          <input name="breakfast" value={formData.breakfast} onChange={handleChange} placeholder="Breakfast recommendation" />
          <input name="lunch" value={formData.lunch} onChange={handleChange} placeholder="Lunch recommendation" />
          <input name="dinner" value={formData.dinner} onChange={handleChange} placeholder="Dinner recommendation" />
          <div className="form-actions">
            <button type="submit" className="btn-save">Save Chart</button>
            <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};


function DietChartPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [dietCharts, setDietCharts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load all patients for the dropdown
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await patientService.getPatients();
        setPatients(response.data);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      }
    };
    loadPatients();
  }, []);

  // Fetch diet charts when a patient is selected
  useEffect(() => {
    if (!selectedPatient) {
      setDietCharts([]);
      return;
    }

    const loadDietCharts = async () => {
      setIsLoading(true);
      try {
        const response = await dietChartService.getDietChartsForPatient(selectedPatient);
        setDietCharts(response.data);
      } catch (error) {
        console.error("Failed to fetch diet charts", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDietCharts();
  }, [selectedPatient]);

  const handleSaveChart = async (chartData) => {
    try {
      await dietChartService.createDietChart(chartData);
      // Refresh the list after saving
      const response = await dietChartService.getDietChartsForPatient(selectedPatient);
      setDietCharts(response.data);
    } catch (error) {
      console.error("Failed to save diet chart", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (window.confirm('Are you sure you want to delete this diet chart?')) {
        try {
            await dietChartService.deleteDietChart(chartId);
            // Refresh list by filtering out the deleted chart
            setDietCharts(prevCharts => prevCharts.filter(c => c._id !== chartId));
        } catch (error) {
            console.error("Failed to delete diet chart", error);
        }
    }
  };

  return (
    <div id="app-view" style={{ display: 'block' }}>
      <Header />
      <main className="dashboard-container">
        <div className="table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Diet Charts</h1>
            <button onClick={() => setIsModalOpen(true)} disabled={!selectedPatient}>
              Create New Chart
            </button>
          </div>

          {/* Patient Selection Dropdown */}
          <div className="patient-selector">
            <label htmlFor="patient-select">Select a Patient: </label>
            <select
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">-- Please choose a patient --</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Display Diet Charts */}
          <div className="diet-chart-list">
            {isLoading && <p>Loading charts...</p>}
            {!isLoading && selectedPatient && dietCharts.length === 0 && <p>No diet charts found for this patient.</p>}
            {dietCharts.map(chart => (
              <div key={chart._id} className="diet-chart-card">
                <h4>Chart from {new Date(chart.startDate).toLocaleDateString()}</h4>
                <p><strong>Diagnosis:</strong> {chart.diagnosis || 'N/A'}</p>
                <p><strong>Notes:</strong> {chart.notes || 'N/A'}</p>
                <div className="actions-cell">
                    <button className="btn-ghost">View/Edit</button>
                    <button onClick={() => handleDeleteChart(chart._id)} className="btn-ghost btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <DietChartFormModal
          patientId={selectedPatient}
          onSave={handleSaveChart}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      <Footer />
    </div>
  );
}

export default DietChartPage;