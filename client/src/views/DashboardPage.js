import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PatientTable from '../components/dashboard/PatientTable';
import { useNavigate } from 'react-router-dom';


function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div id="app-view">
        <Header />
        <div id="dashboard-content" className="dashboard-container">
          <div className="table-container">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
              <h2>Recent Patients</h2>
              <button onClick={() => navigate('/diet-chart')}>New Diet Chart</button>
            </div>
            <PatientTable />
          </div>
        </div>
        <Footer />
    </div>
  );
}

export default DashboardPage;