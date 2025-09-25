import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../../services/authService'; // Import the auth service

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
    authService.logout(); // Call the service to clear user data
    navigate('/login');
  };

  return (
    <header id="app-header">
      {/* Brand/Logo */}
      <div className="brand">
        <div className="logo">AD</div>
        <div>
          <h1>Ayur Diet Pro</h1>
          <p>Ayurvedic Diet Management Software</p>
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
          
          {/* Logout button is now inside the nav-links bar */}
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