import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import dietChartService from '../services/dietChartService';
import patientService from '../services/patientService';

function ViewDietChartPage() {
  const { chartId } = useParams();
  const navigate = useNavigate();
  const [chart, setChart] = useState(null);
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true);
        
        // Load the diet chart
        const chartResponse = await dietChartService.getDietChart(chartId);
        const chartData = chartResponse.data;
        setChart(chartData);

        // Load the patient data
        if (chartData.patientId) {
          const patientResponse = await patientService.getPatient(chartData.patientId);
          setPatient(patientResponse.data);
        }
      } catch (error) {
        console.error('Error loading chart data:', error);
        setError('Failed to load diet chart');
      } finally {
        setIsLoading(false);
      }
    };

    if (chartId) {
      loadChartData();
    }
  }, [chartId]);

  if (isLoading) {
    return (
      <div id="app-view">
        <Header />
        <main className="dashboard-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="loading-spinner"></div>
            <p>Loading diet chart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !chart) {
    return (
      <div id="app-view">
        <Header />
        <main className="dashboard-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <h2>Diet Chart Not Found</h2>
            <p>{error || 'The requested diet chart could not be found.'}</p>
            <button onClick={() => navigate('/diet-chart')}>
              Back to Diet Charts
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div id="app-view">
      <Header />
      <main className="dashboard-container">
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(24, 39, 51, 0.05)'
        }}>
          <div>
            <h1>Diet Chart Details</h1>
            {patient && (
              <p style={{ margin: '5px 0', color: '#666' }}>
                Patient: <strong>{patient.name}</strong> | 
                Created: {new Date(chart.startDate || chart.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => navigate('/diet-chart')}
              className="btn-ghost"
            >
              Back to List
            </button>
            <button onClick={() => window.print()}>
              Print Chart
            </button>
          </div>
        </div>

        {/* Chart Information */}
        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 10px rgba(24, 39, 51, 0.05)'
        }}>
          <h3>Chart Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <strong>Diagnosis:</strong>
              <p>{chart.diagnosis || 'Not specified'}</p>
            </div>
            <div>
              <strong>Duration:</strong>
              <p>{chart.duration || '7'} days</p>
            </div>
            <div>
              <strong>Created:</strong>
              <p>{new Date(chart.startDate || chart.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <strong>Status:</strong>
              <p style={{ color: 'green' }}>Active</p>
            </div>
          </div>
          
          {chart.notes && (
            <div style={{ marginTop: '20px' }}>
              <strong>Notes:</strong>
              <p style={{ 
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px', 
                margin: '10px 0 0 0' 
              }}>
                {chart.notes}
              </p>
            </div>
          )}
        </div>

        {/* Meal Plan */}
        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 10px rgba(24, 39, 51, 0.05)'
        }}>
          <h3>Meal Plan</h3>
          
          {chart.meals && chart.meals.length > 0 ? (
            <div className="meal-plan-grid" style={{ 
              display: 'grid', 
              gap: '20px' 
            }}>
              {chart.meals.map((meal, index) => (
                <div key={index} style={{ 
                  border: '1px solid #eef6f5',
                  borderRadius: '8px',
                  padding: '15px',
                  background: '#fbffff'
                }}>
                  <h4 style={{ 
                    margin: '0 0 15px 0',
                    color: 'var(--accent)',
                    borderBottom: '1px solid #eef6f5',
                    paddingBottom: '5px'
                  }}>
                    {meal.day}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                      <strong>Breakfast:</strong>
                      <p style={{ fontSize: '14px', margin: '5px 0' }}>{meal.breakfast || 'Not specified'}</p>
                    </div>
                    <div>
                      <strong>Lunch:</strong>
                      <p style={{ fontSize: '14px', margin: '5px 0' }}>{meal.lunch || 'Not specified'}</p>
                    </div>
                    <div>
                      <strong>Dinner:</strong>
                      <p style={{ fontSize: '14px', margin: '5px 0' }}>{meal.dinner || 'Not specified'}</p>
                    </div>
                    {meal.snacks && (
                      <div>
                        <strong>Snacks:</strong>
                        <p style={{ fontSize: '14px', margin: '5px 0' }}>{meal.snacks}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              background: '#f8f9fa',
              borderRadius: '8px',
              color: '#666'
            }}>
              <p>No detailed meal plan available for this chart.</p>
              <p style={{ fontSize: '14px' }}>This chart may have been created with the basic form.</p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        {chart.recommendations && (
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 4px 10px rgba(24, 39, 51, 0.05)'
          }}>
            <h3>Recommendations</h3>
            <p style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              margin: '10px 0 0 0'
            }}>
              {chart.recommendations}
            </p>
          </div>
        )}

        {/* Chart Data Summary */}
        {chart.chartData && (
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 4px 10px rgba(24, 39, 51, 0.05)'
          }}>
            <h3>Chart Summary</h3>
            <div style={{ 
              background: '#e9ecef',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <p><strong>Summary:</strong> {chart.chartData.summary || 'Diet chart'}</p>
              {chart.chartData.totalItems && (
                <p><strong>Total Food Items:</strong> {chart.chartData.totalItems}</p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ViewDietChartPage;