import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import RegistrationPage from './views/RegistrationPage'; // Import the new page
import DashboardPage from './views/DashboardPage';
import DietChartPage from './views/DietChartPage';
import PatientsPage from './views/PatientsPage'; // Import new page
import FoodsPage from './views/FoodsPage';       // Import new page
import RecipesPage from './views/RecipesPage';   // Import new page
import ReportsPage from './views/ReportsPage';   // Import new page
import SettingsPage from './views/SettingsPage'; // Import new page

function App() {
  // A simple check for authentication. In a real app, this would be more robust.
  const isLoggedIn = true; // Change this to false to see the login page

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} /> {/* <-- ADD THIS LINE */}
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/diet-chart" element={isLoggedIn ? <DietChartPage /> : <Navigate to="/login" />} />
        <Route path="/patients" element={isLoggedIn ? <PatientsPage /> : <Navigate to="/login" />} />
        <Route path="/foods" element={isLoggedIn ? <FoodsPage /> : <Navigate to="/login" />} />
        <Route path="/recipes" element={isLoggedIn ? <RecipesPage /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isLoggedIn ? <ReportsPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" />} />
        
        {/* Default route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;