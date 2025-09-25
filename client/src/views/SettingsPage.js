import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import authService from '../services/authService'; // Import the auth service

function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch the current user's data when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getMe();
        setProfile({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []); // The empty array ensures this runs only once on mount

  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div id="app-view" style={{ display: 'block' }}>
      <Header />
      <main className="dashboard-container">
        <div className="table-container">
          <h1>Settings</h1>

          <div className="settings-grid">
            <div className="settings-section">
              <h3>User Profile</h3>
              {isLoading ? (
                <p>Loading profile...</p>
              ) : (
                <div className="settings-form">
                  <div className="form-field">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      readOnly // Email should not be editable
                    />
                  </div>
                  <button>Update Profile</button>
                </div>
              )}
            </div>

            <div className="settings-section">
              <h3>Preferences</h3>
              <div className="settings-form">
                <div className="form-field">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    name="theme"
                    value={preferences.theme}
                    onChange={handlePreferencesChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={preferences.notifications}
                    onChange={handlePreferencesChange}
                  />
                  <label htmlFor="notifications">Enable email notifications</label>
                </div>
                <button>Save Preferences</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SettingsPage;