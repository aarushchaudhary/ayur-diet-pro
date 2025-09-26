import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FoodLibrary from '../components/diet-chart/FoodLibrary';
import PlanEditor from '../components/diet-chart/PlanEditor';
import AnalyticsDashboard from '../components/diet-chart/AnalyticsDashboard';
import PatientProfile from '../components/diet-chart/PatientProfile';
import { foodDatabase } from '../mockData';
import patientService from '../services/patientService';
import dietChartService from '../services/dietChartService';

function NewDietChartCreationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  // Patient information
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showPatientForm, setShowPatientForm] = useState(false);

  // Diet plan state - the core of the application
  const [dietPlan, setDietPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  // Chart metadata
  const [chartMetadata, setChartMetadata] = useState({
    diagnosis: '',
    duration: '7',
    notes: '',
    recommendations: ''
  });

  // UI State
  const [activeTab, setActiveTab] = useState('foods');
  const [isLoading, setIsLoading] = useState(false);

  // Load patients and set selected patient
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await patientService.getPatients();
        setPatients(response.data);
        
        if (patientId) {
          const patient = response.data.find(p => p._id === patientId);
          if (patient) {
            setSelectedPatient(patient);
          }
        }
      } catch (error) {
        console.error("Failed to fetch patients", error);
      }
    };
    loadPatients();
  }, [patientId]);

  // Handler to add a food item to a meal
  const handleAddFood = (meal, food) => {
    const newItem = {
      ...food,
      instanceId: Date.now() + Math.random(), // Unique ID for this specific instance
      portion: 100, // Default portion in grams
    };
    
    setDietPlan(prevPlan => ({
      ...prevPlan,
      [meal]: [...prevPlan[meal], newItem],
    }));
  };

  // Handler to remove a food item from a meal
  const handleRemoveFood = (meal, instanceId) => {
    setDietPlan(prevPlan => ({
      ...prevPlan,
      [meal]: prevPlan[meal].filter(item => item.instanceId !== instanceId),
    }));
  };

  // Handler to update portion size
  const handleUpdatePortion = (meal, instanceId, newPortion) => {
    setDietPlan(prevPlan => ({
      ...prevPlan,
      [meal]: prevPlan[meal].map(item => 
        item.instanceId === instanceId 
          ? { ...item, portion: newPortion }
          : item
      ),
    }));
  };

  // Save the complete diet chart
  const handleSaveChart = async () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    if (Object.values(dietPlan).every(meal => meal.length === 0)) {
      alert('Please add at least one food item to the diet plan');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the diet chart data
      const chartData = {
        patientId: selectedPatient._id,
        diagnosis: chartMetadata.diagnosis,
        notes: chartMetadata.notes,
        duration: chartMetadata.duration,
        recommendations: chartMetadata.recommendations,
        chartData: {
          summary: `${chartMetadata.duration}-day Ayurvedic Diet Plan`,
          totalItems: Object.values(dietPlan).reduce((sum, meal) => sum + meal.length, 0)
        },
        meals: generateMealPlan(dietPlan, parseInt(chartMetadata.duration))
      };

      await dietChartService.createDietChart(chartData);
      alert('Diet chart saved successfully!');
      navigate('/diet-chart');
    } catch (error) {
      console.error("Failed to save diet chart", error);
      alert('Error saving diet chart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate meal plan for the specified number of days
  const generateMealPlan = (plan, days) => {
    const meals = [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < days; i++) {
      const dayName = daysOfWeek[i % 7];
      meals.push({
        day: `Day ${i + 1} (${dayName})`,
        breakfast: plan.breakfast.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'As per preference',
        lunch: plan.lunch.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'As per preference',
        dinner: plan.dinner.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'As per preference',
        snacks: plan.snacks.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'Optional'
      });
    }
    return meals;
  };

  // Calculate total nutrition for display
  const totalNutrition = useMemo(() => {
    const allFoods = Object.values(dietPlan).flat();
    return allFoods.reduce((total, food) => {
      const multiplier = (food.portion || 100) / 100;
      return {
        calories: total.calories + (food.kcal * multiplier),
        carbs: total.carbs + (food.carbs * multiplier),
        protein: total.protein + (food.protein * multiplier),
        fat: total.fat + (food.fat * multiplier)
      };
    }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
  }, [dietPlan]);

  return (
    <div id="app-view">
      <Header />
      <main className="new-diet-chart-creation">
        {/* Header Section */}
        <div className="creation-header" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Create New Diet Chart</h1>
              <p style={{ margin: '5px 0', color: '#666' }}>
                {selectedPatient ? `For: ${selectedPatient.name}` : 'Please select a patient'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => navigate('/diet-chart')}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChart}
                disabled={isLoading || !selectedPatient}
                style={{ 
                  backgroundColor: (!selectedPatient || isLoading) ? '#ccc' : '#28a745',
                  cursor: (!selectedPatient || isLoading) ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Saving...' : 'Save Diet Chart'}
              </button>
            </div>
          </div>
        </div>

        {/* Patient Selection */}
        {!selectedPatient && (
          <div style={{ padding: '20px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
            <h3>Select Patient</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <select
                value={selectedPatient?._id || ''}
                onChange={(e) => {
                  const patient = patients.find(p => p._id === e.target.value);
                  setSelectedPatient(patient);
                }}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '300px' }}
              >
                <option value="">-- Select a patient --</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} - {p.abhaId || 'No ABHA ID'}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setShowPatientForm(!showPatientForm)}
                className="btn-ghost"
              >
                {showPatientForm ? 'Hide' : 'Add New Patient'}
              </button>
            </div>
            
            {showPatientForm && (
              <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <PatientProfile />
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {selectedPatient && (
          <>
            {/* Chart Metadata */}
            <div style={{ padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #dee2e6' }}>
              <h3>Chart Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Diagnosis</label>
                  <input
                    type="text"
                    placeholder="e.g., Vata Imbalance, Digestive Issues"
                    value={chartMetadata.diagnosis}
                    onChange={(e) => setChartMetadata(prev => ({ ...prev, diagnosis: e.target.value }))}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration (days)</label>
                  <select
                    value={chartMetadata.duration}
                    onChange={(e) => setChartMetadata(prev => ({ ...prev, duration: e.target.value }))}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="21">21 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>General Notes</label>
                <textarea
                  placeholder="Special dietary instructions, allergies, preferences..."
                  value={chartMetadata.notes}
                  onChange={(e) => setChartMetadata(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px' }}
                />
              </div>

              {/* Nutrition Summary */}
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Daily Nutrition Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
                      {Math.round(totalNutrition.calories)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Calories</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                      {Math.round(totalNutrition.carbs)}g
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Carbs</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
                      {Math.round(totalNutrition.protein)}g
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Protein</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
                      {Math.round(totalNutrition.fat)}g
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Fat</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid #dee2e6' }}>
              <div style={{ display: 'flex', padding: '0 20px' }}>
                {[
                  { key: 'foods', label: 'Food Library' },
                  { key: 'plan', label: 'Diet Plan' },
                  { key: 'analytics', label: 'Analytics' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '15px 20px',
                      border: 'none',
                      backgroundColor: activeTab === tab.key ? '#007bff' : 'transparent',
                      color: activeTab === tab.key ? 'white' : '#666',
                      cursor: 'pointer',
                      borderBottom: activeTab === tab.key ? '3px solid #007bff' : '3px solid transparent'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="new-diet-chart-page" style={{ display: 'flex', minHeight: 'calc(100vh - 200px)' }}>
              {activeTab === 'foods' && (
                <div style={{ flex: 1, padding: '20px' }}>
                  <FoodLibrary 
                    foods={foodDatabase} 
                    onAddFood={handleAddFood} 
                  />
                </div>
              )}
              
              {activeTab === 'plan' && (
                <div style={{ flex: 1, padding: '20px' }}>
                  <PlanEditor 
                    plan={dietPlan} 
                    onRemoveFood={handleRemoveFood}
                    onUpdatePortion={handleUpdatePortion}
                  />
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div style={{ flex: 1, padding: '20px' }}>
                  <AnalyticsDashboard 
                    plan={dietPlan} 
                  />
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default NewDietChartCreationPage;