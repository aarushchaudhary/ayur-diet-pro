import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import dietChartService from '../services/dietChartService';

function ViewDietChartPage() {
  const { chartId } = useParams();
  const navigate = useNavigate();
  const [chart, setChart] = useState(null);
  // The 'patient' state is no longer needed, as it's part of the chart object
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true);
        // Only one API call is needed now
        const response = await dietChartService.getDietChart(chartId);
        setChart(response.data);
      } catch (error) {
        console.error('Error loading chart data:', error);
        setError('Failed to load diet chart. It may have been deleted or you may not have permission to view it.');
      } finally {
        setIsLoading(false);
      }
    };

    if (chartId) {
      loadChartData();
    }
  }, [chartId]);

  // Loading State
  if (isLoading) {
    return (
      <div id="app-view">
        <Header />
        <main className="dashboard-container" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner"></div>
          <p>Loading diet chart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error || !chart) {
    return (
      <div id="app-view">
        <Header />
        <main className="dashboard-container" style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Diet Chart Not Found</h2>
          <p>{error || 'The requested diet chart could not be found.'}</p>
          <button onClick={() => navigate('/diet-chart')}>
            Back to Diet Charts
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Success State
  return (
    <div id="app-view">
      <Header />
      <main className="dashboard-container">
        {/* Header Section */}
        <div className="table-header" style={{ background: 'var(--card)', padding: '20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)'}}>
          <div>
            <h1>Diet Chart Details</h1>
            {/* Access patient info directly from chart.patient */}
            {chart.patient && (
              <p style={{ margin: '5px 0', color: 'var(--muted)' }}>
                Patient: <strong>{chart.patient.name}</strong> | 
                Created: {new Date(chart.startDate || chart.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/diet-chart')} className="btn-ghost">
              Back to List
            </button>
            <button onClick={() => window.print()}>
              Print Chart
            </button>
          </div>
        </div>

        {/* Chart Information */}
        <div className="panel">
          <h3>Chart Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <strong>Diagnosis:</strong>
              <p>{chart.diagnosis || 'Not specified'}</p>
            </div>
            <div>
              <strong>Duration:</strong>
              <p>{chart.meals?.length || 'N/A'} days</p>
            </div>
            <div>
              <strong>Created:</strong>
              <p>{new Date(chart.startDate || chart.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <strong>Status:</strong>
              <p style={{ color: 'green', fontWeight: 'bold' }}>{chart.status || 'Active'}</p>
            </div>
          </div>
          {chart.notes && (
            <div style={{ marginTop: '20px' }}>
              <strong>Notes:</strong>
              <p style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', margin: '10px 0 0 0' }}>
                {chart.notes}
              </p>
            </div>
          )}
        </div>

        {/* Meal Plan */}
        <div className="panel" style={{marginTop: "20px"}}>
          <h3>Meal Plan</h3>
          {chart.meals && chart.meals.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {chart.meals.map((meal, index) => (
                <div key={index} style={{ border: '1px solid #eef6f5', borderRadius: '8px', padding: '15px', background: '#fbffff' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: 'var(--accent)', borderBottom: '1px solid #eef6f5', paddingBottom: '5px' }}>
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
            <div className="empty-state">
              <h4>No Meal Plan Details</h4>
              <p>This diet chart does not have a detailed day-by-day meal plan.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ViewDietChartPage;