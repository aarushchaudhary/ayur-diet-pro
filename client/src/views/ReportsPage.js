import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function ReportsPage() {
  return (
    <div id="app-view" style={{display: 'block'}}>
      <Header />
      <main className="dashboard-container">
        <h1>Reports</h1>
        <p>This is where the analytics and reporting content will go.</p>
      </main>
      <Footer />
    </div>
  );
}

export default ReportsPage;