import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PatientTable from '../components/dashboard/PatientTable';
import dietChartService from '../services/dietChartService';
import patientService from '../services/patientService';
import { calculateAge } from '../utils/dateUtils';

function EnhancedDietChartPage() {
  const navigate = useNavigate();
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

  const handleCreateNewChart = () => {
    if (selectedPatient) {
      // Navigate to new diet chart creation page with patient ID
      navigate(`/diet-chart/new?patientId=${selectedPatient}`);
    } else {
      alert('Please select a patient first');
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

  const handleViewChart = (chartId) => {
    navigate(`/diet-chart/view/${chartId}`);
  };

  return (
    <div id="app-view" style={{ display: 'block' }}>
      <Header />
      <main className="dashboard-container">
        <div className="table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Diet Chart Management</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleCreateNewChart} 
                disabled={!selectedPatient}
                className={!selectedPatient ? 'btn-disabled' : ''}
                style={{ backgroundColor: !selectedPatient ? '#ccc' : '#007bff' }}
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
          </div>

          {/* Patient Selection Section */}
          <div className="patient-selector" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3>Select Patient</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <label htmlFor="patient-select" style={{ fontWeight: 'bold', minWidth: '120px' }}>Patient: </label>
              <select
                id="patient-select"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                style={{ flex: 1, maxWidth: '400px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="">-- Please choose a patient --</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Age: {calculateAge(p.dob) || 'N/A'}) - {p.abhaId || 'No ABHA ID'}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => navigate('/patients')}
                className="btn-ghost"
                style={{ whiteSpace: 'nowrap' }}
              >
                Manage Patients
              </button>
            </div>
            
            {selectedPatient && (
              <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                {(() => {
                  const patient = patients.find(p => p._id === selectedPatient);
                  return patient ? (
                    <p>
                      <strong>Selected:</strong> {patient.name} | 
                      <strong> Gender:</strong> {patient.gender || 'N/A'} | 
                      <strong> Dietary Notes:</strong> {patient.dietaryHabits || 'None'}
                    </p>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Diet Charts Display */}
          <div className="diet-chart-list">
            <h3>Existing Diet Charts {selectedPatient && `(${dietCharts.length} charts)`}</h3>
            
            {isLoading && <p>Loading charts...</p>}
            
            {!isLoading && selectedPatient && dietCharts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p>No diet charts found for this patient.</p>
                <p style={{ color: '#666', fontSize: '14px' }}>Create a new comprehensive diet chart using our advanced tools.</p>
                <button onClick={handleCreateNewChart} style={{ marginTop: '10px' }}>
                  Create First Chart
                </button>
              </div>
            )}
            
            {!selectedPatient && (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>Please select a patient to view their diet charts.</p>
              </div>
            )}

            {dietCharts.length > 0 && (
              <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {dietCharts.map(chart => (
                  <div key={chart._id} className="diet-chart-card" style={{ 
                    padding: '20px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ marginBottom: '15px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                        Chart #{chart._id.slice(-6)}
                      </h4>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        Created: {new Date(chart.startDate || chart.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Diagnosis:</strong> {chart.diagnosis || 'N/A'}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Duration:</strong> {chart.duration || '7 days'}
                      </p>
                      {chart.notes && (
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                          <strong>Notes:</strong> {chart.notes.substring(0, 60)}{chart.notes.length > 60 ? '...' : ''}
                        </p>
                      )}
                    </div>

                    <div className="actions-cell" style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleViewChart(chart._id)}
                        style={{ flex: 1, padding: '8px', fontSize: '14px' }}
                      >
                        View/Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteChart(chart._id)} 
                        className="btn-ghost btn-delete"
                        style={{ padding: '8px 12px', fontSize: '14px', color: '#dc3545' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Section */}
          {selectedPatient && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
              <h4>Quick Statistics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                    {dietCharts.length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Total Charts</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {dietCharts.filter(chart => {
                      const createdDate = new Date(chart.startDate || chart.createdAt);
                      const daysDiff = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
                      return daysDiff <= 30;
                    }).length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>This Month</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                    {dietCharts.length > 0 ? 
                      new Date(Math.max(...dietCharts.map(chart => new Date(chart.startDate || chart.createdAt)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'N/A'
                    }
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Latest Chart</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EnhancedDietChartPage;