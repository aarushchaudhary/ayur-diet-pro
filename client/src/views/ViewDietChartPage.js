import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import AccordionItem from '../components/common/AccordionItem';
import ChartVisualizations from '../components/diet-chart/ChartVisualizations'; // 1. Import the new component
import dietChartService from '../services/dietChartService';

function ViewDietChartPage() {
  const { chartId } = useParams();
  const navigate = useNavigate();
  const [chart, setChart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true);
        const response = await dietChartService.getDietChart(chartId);
        setChart(response.data);
      } catch (error) {
        console.error('Error loading chart data:', error);
        setError('Failed to load diet chart.');
      } finally {
        setIsLoading(false);
      }
    };

    if (chartId) loadChartData();
  }, [chartId]);

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

  return (
    <div id="app-view">
      <Header />

      {/* --- MODIFIED HEADER STRUCTURE --- */}
      <div className="view-chart-header-wrapper">
        <div className="view-chart-header">
          <div className="header-title">
            <h1>Diet Chart Details</h1>
          </div>
          <div className="header-patient-name">
            {chart.patient && (
              <p>Patient: <strong>{chart.patient.name}</strong></p>
            )}
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/diet-chart')} className="btn-ghost">
              Back to List
            </button>
            <button onClick={() => window.print()}>
              Print Chart
            </button>
          </div>
        </div>
      </div>
      
      <main className="dashboard-container">
        {/* --- MODIFIED LAYOUT: TWO COLUMNS --- */}
        <div className="view-chart-grid-with-charts">
          {/* Left Column */}
          <div className="left-column">
            <div className="panel">
              <h3>Chart Information</h3>
              <div className="info-grid">
                <div><strong>Diagnosis:</strong><p>{chart.diagnosis || 'N/A'}</p></div>
                <div><strong>Duration:</strong><p>{chart.meals?.length || 'N/A'} days</p></div>
                <div><strong>Created:</strong><p>{new Date(chart.startDate || chart.createdAt).toLocaleDateString()}</p></div>
                <div><strong>Status:</strong><p style={{ color: 'green', fontWeight: 'bold' }}>{chart.status || 'Active'}</p></div>
              </div>
              {chart.notes && (<div className="info-notes"><strong>Notes:</strong><p>{chart.notes}</p></div>)}
            </div>
            <div className="panel">
              <h3>Meal Plan Details</h3>
              {chart.meals && chart.meals.length > 0 ? (
                <div className="meal-plan-accordion">
                  {chart.meals.map((meal, index) => (
                    <AccordionItem key={index} title={meal.day}>
                      <div className="meal-items-grid">
                        <div><strong>Breakfast:</strong><p>{meal.breakfast || 'N/A'}</p></div>
                        <div><strong>Lunch:</strong><p>{meal.lunch || 'N/A'}</p></div>
                        <div><strong>Dinner:</strong><p>{meal.dinner || 'N/A'}</p></div>
                        {meal.snacks && (<div><strong>Snacks:</strong><p>{meal.snacks}</p></div>)}
                      </div>
                    </AccordionItem>
                  ))}
                </div>
              ) : (<div className="empty-state"><h4>No Meal Plan Details</h4></div>)}
            </div>
          </div>

          {/* Right Column */}
          <aside className="right-column">
            {/* 2. Place the new chart component here */}
            <ChartVisualizations chart={chart} />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ViewDietChartPage;