import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import dietChartService from '../services/dietChartService';
import patientService from '../services/patientService';
import { calculateAge } from '../utils/dateUtils';

function EnhancedDietChartPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [dietCharts, setDietCharts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await patientService.getPatients();
        setPatients(response.data || []);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      }
    };
    loadPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      setDietCharts([]);
      return;
    }
    const loadDietCharts = async () => {
      setIsLoading(true);
      try {
        const response = await dietChartService.getDietChartsForPatient(selectedPatient);
        setDietCharts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch diet charts", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDietCharts();
  }, [selectedPatient]);

  const handleCreateNewChart = () => {
    if (selectedPatient) {
      navigate(`/diet-chart/new?patientId=${selectedPatient}`);
    } else {
      alert('Please select a patient first');
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (window.confirm('Are you sure you want to delete this diet chart?')) {
      try {
        await dietChartService.deleteDietChart(chartId);
        setDietCharts(prevCharts => prevCharts.filter(c => c._id !== chartId));
      } catch (error) {
        console.error("Failed to delete diet chart", error);
      }
    }
  };

  const handleViewChart = (chartId) => {
    navigate(`/diet-chart/view/${chartId}`);
  };

  const currentPatient = patients.find(p => p._id === selectedPatient);

  return (
    <div id="app-view">
      <Header />
      <main className="dashboard-container">
        <div className="table-header">
          <h1>Diet Chart Management</h1>
        </div>

        <div className="creation-page-grid">
          {/* Sidebar */}
          <aside className="diet-chart-sidebar">
            <div className="patient-selector-card">
              <h3>Select Patient</h3>
              <div className="form-field">
                <label htmlFor="patient-select">Patient</label>
                <select
                  id="patient-select"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">-- Choose a patient --</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({calculateAge(p.dob) || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
              {currentPatient && (
                <div className="patient-meta-info">
                  <strong>Gender:</strong> {currentPatient.gender || 'N/A'} <br/>
                  <strong>Dietary Notes:</strong> {currentPatient.dietaryHabits || 'None'}
                </div>
              )}
            </div>
            
            {/* Action Buttons Moved Here */}
            <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleCreateNewChart}
                disabled={!selectedPatient}
                className={!selectedPatient ? 'btn-disabled' : ''}
              >
                Create New Chart
              </button>
              <button
                onClick={() => navigate('/diet-chart/analytics')}
                className="btn-ghost"
              >
                View Analytics
              </button>
            </div>
            
             <button
                onClick={() => navigate('/patients')}
                className="btn-ghost"
                style={{ width: '100%' }}
              >
                Manage Patients
              </button>
          </aside>

          {/* Main Content */}
          <section className="diet-charts-container">
            <h3>
              Existing Diet Charts
              {currentPatient && ` for ${currentPatient.name} (${dietCharts.length})`}
            </h3>

            {isLoading && <p>Loading charts...</p>}

            {!selectedPatient && !isLoading && (
              <div className="empty-chart-state">
                <p>Please select a patient to view their diet charts.</p>
              </div>
            )}

            {selectedPatient && !isLoading && dietCharts.length === 0 && (
              <div className="empty-chart-state">
                <p>No diet charts found for this patient.</p>
                <button onClick={handleCreateNewChart}>Create First Chart</button>
              </div>
            )}

            {dietCharts.length > 0 && (
              <div className="charts-grid">
                {dietCharts.map(chart => (
                  <div key={chart._id} className="diet-chart-card-item">
                    <h4>Chart #{chart._id.slice(-6)}</h4>
                    <p>
                      <strong>Created:</strong> {new Date(chart.startDate || chart.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Diagnosis:</strong> {chart.diagnosis || 'N/A'}
                    </p>
                     <p>
                      <strong>Duration:</strong> {chart.duration || '7 days'}
                    </p>
                    <div className="actions-cell">
                      <button onClick={() => handleViewChart(chart._id)}>
                        View/Edit
                      </button>
                      <button onClick={() => handleDeleteChart(chart._id)} className="btn-ghost btn-delete">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EnhancedDietChartPage;