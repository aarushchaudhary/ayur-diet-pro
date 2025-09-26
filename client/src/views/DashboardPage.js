import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import reportService from '../services/reportService';
import PatientTable from '../components/dashboard/PatientTable';

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reportService.getSummary();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value }) => (
    <div className="stat-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );

  return (
    <div id="app-view" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main className="dashboard-container">
        {/* TOP ROW: Contains the three action cards */}
        <div className="dashboard-row-top">
          {/* Patient Search Card */}
          <div className="action-card">
            <h3>Patient Search</h3>
            <p>Find and open patient profiles</p>
            <div className="search-bar">
              <input type="text" placeholder="Search by patient name" />
              <button>Search</button>
            </div>
          </div>

          {/* Food Database Card */}
          <div className="action-card">
            <h3>Food Database</h3>
            <p>8,000+ items with Ayurvedic properties.</p>
            <button onClick={() => navigate('/foods')}>Browse Foods</button>
          </div>

          {/* Recipe Analyzer Card */}
          <div className="action-card">
            <h3>Recipe Analyzer</h3>
            <p>Auto nutrient and Rasa breakdown.</p>
            <button onClick={() => navigate('/recipes')}>Analyze</button>
          </div>
        </div>

        {/* BOTTOM ROW: Contains Insights and Recent Patients */}
        <div className="dashboard-row-bottom">
          {/* Insights Section */}
          <div className="insights-container">
            <h3>Insights</h3>
            <p>Trends across your practice.</p>
            {loading ? (
              <p>Loading insights...</p>
            ) : stats ? (
              <div className="stats-grid">
                <StatCard title="Total Patients" value={stats.totalPatients} />
                <StatCard title="Total Recipes" value={stats.totalRecipes} />
                <StatCard title="Diet Charts" value={stats.totalDietCharts} />
                <StatCard title="Avg. Calories" value={`${stats.averageCalories} kcal`} />
              </div>
            ) : (
              <p>No insights available.</p>
            )}
          </div>

          {/* Recent Patients Table */}
          <div className="table-container">
            <div className="table-header">
              <h2>Recent Patients</h2>
              <button onClick={() => navigate('/diet-chart')}>
                <span className="material-icons-round">receipt_long</span>
                Diet Charts
              </button>
            </div>
            <PatientTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;
