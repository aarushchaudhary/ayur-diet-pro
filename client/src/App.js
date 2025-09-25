import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import DashboardPage from './views/DashboardPage';
import DietChartPage from './views/DietChartPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header can be conditionally rendered based on route */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/diet-chart" element={<DietChartPage />} />
        </Routes>
        {/* Footer can also be conditionally rendered */}
      </div>
    </Router>
  );
}

export default App;