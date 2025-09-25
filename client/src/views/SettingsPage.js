import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function SettingsPage() {
  return (
    <div id="app-view" style={{display: 'block'}}>
      <Header />
      <main className="dashboard-container">
        <h1>Settings</h1>
        <p>This is where the application settings will go.</p>
      </main>
      <Footer />
    </div>
  );
}

export default SettingsPage;