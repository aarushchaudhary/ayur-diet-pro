import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import logo from 'assets/favicon.png'; // 1. Import the logo

// A simple component for icon-based nav links
const NavItem = ({ to, icon, label }) => (
  <NavLink to={to} className="nav-link">
    <span className="material-icons-round">{icon}</span>
    {label}
  </NavLink>
);

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header id="app-header">
      {/* Brand/Logo */}
      <div className="brand">
        {/* 2. Replace the 'AD' div with the image tag */}
        <img src={logo} alt="Ayur Diet App Logo" className="logo-img" />
        <div>
          <h1>Ayur Diet App</h1>
          <p>Ayurvedic Diet Management System</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="nav-container">
        <div className="nav-links">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" />
          <NavItem to="/patients" icon="groups" label="Patients" />
          <NavItem to="/foods" icon="restaurant_menu" label="Foods" />
          <NavItem to="/recipes" icon="menu_book" label="Recipes" />
          <NavItem to="/reports" icon="analytics" label="Reports" />
          <NavItem to="/settings" icon="settings" label="Settings" />
          
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <span className="material-icons-round">logout</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;