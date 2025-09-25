import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import reportService from '../services/reportService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Reusable components for the report page
const StatCard = ({ title, value }) => (
    <div className="stat-card">
        <h4>{title}</h4>
        <p>{value}</p>
    </div>
);

const ChartCard = ({ title, chart }) => (
    <div className="report-card">
        <h3>{title}</h3>
        <div className="chart-container">
            {chart}
        </div>
    </div>
);

function ReportsPage() {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await reportService.getSummary();
                setSummary(response.data);
            } catch (error) {
                console.error("Failed to fetch report summary:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (isLoading || !summary) {
        return (
            <div id="app-view" style={{ display: 'block' }}>
                <Header />
                <main className="dashboard-container"><p>Loading reports...</p></main>
                <Footer />
            </div>
        );
    }
    
    // Data for Charts
    const genderData = {
        labels: Object.keys(summary.genderDistribution),
        datasets: [{
            data: Object.values(summary.genderDistribution),
            backgroundColor: ['#2b8a78', '#f08a5d', '#65737e'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };
    
    const activityData = {
        labels: Object.keys(summary.activityLevelDistribution),
        datasets: [{
            label: 'Number of Patients',
            data: Object.values(summary.activityLevelDistribution),
            backgroundColor: '#2b8a78',
        }],
    };

    const topFoodsData = {
        labels: Object.keys(summary.topFoods),
        datasets: [{
            label: 'Times Used in Diet Charts',
            data: Object.values(summary.topFoods),
            backgroundColor: '#f08a5d',
        }],
    };

    return (
        <div id="app-view" style={{ display: 'block' }}>
            <Header />
            <main className="dashboard-container">
                <div className="table-container">
                    <div style={{ marginBottom: '20px' }}>
                        <h1>Reports & Analytics</h1>
                    </div>
                    
                    <div className="stats-grid">
                        <StatCard title="Total Patients" value={summary.totalPatients} />
                        <StatCard title="Total Recipes" value={summary.totalRecipes} />
                        <StatCard title="Total Diet Charts" value={summary.totalDietCharts} />
                        <StatCard title="Avg. Daily Kcal" value={`${summary.averageCalories} kcal`} />
                    </div>

                    <div className="reports-grid">
                        <ChartCard title="Gender Distribution" chart={<Pie data={genderData} />} />
                        <ChartCard title="Patient Activity Levels" chart={<Bar data={activityData} />} />
                        <ChartCard title="Most Prescribed Foods" chart={<Bar data={topFoodsData} />} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ReportsPage;