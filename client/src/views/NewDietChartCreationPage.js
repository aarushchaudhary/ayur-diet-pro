import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FoodLibrary from '../components/diet-chart/FoodLibrary';
import PlanEditor from '../components/diet-chart/PlanEditor';
import AnalyticsDashboard from '../components/diet-chart/AnalyticsDashboard';
import { foodDatabase } from '../mockData';
import patientService from '../services/patientService';
import dietChartService from '../services/dietChartService';

function NewDietChartCreationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dietPlan, setDietPlan] = useState({
    breakfast: [], lunch: [], dinner: [], snacks: []
  });
  const [chartMetadata, setChartMetadata] = useState({
    diagnosis: '', duration: '7', notes: ''
  });
  const [activeTab, setActiveTab] = useState('foods'); // To control which section is visible
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPatientData = async () => {
      if (!patientId) {
        navigate('/diet-chart');
        return;
      }
      try {
        const response = await patientService.getPatients();
        const allPatients = response.data || [];
        const currentPatient = allPatients.find(p => p._id === patientId);
        
        if (currentPatient) {
          setSelectedPatient(currentPatient);
        } else {
          console.error(`Patient with ID ${patientId} not found.`);
          navigate('/diet-chart');
        }
      } catch (error) {
        console.error("Failed to fetch patient data, redirecting.", error);
        navigate('/diet-chart');
      }
    };
    loadPatientData();
  }, [patientId, navigate]);

  const handleAddFood = (meal, food) => {
    const newItem = { ...food, instanceId: Date.now() + Math.random(), portion: 100 };
    setDietPlan(prev => ({ ...prev, [meal]: [...prev[meal], newItem] }));
  };

  const handleRemoveFood = (meal, instanceId) => {
    setDietPlan(prev => ({ ...prev, [meal]: prev[meal].filter(i => i.instanceId !== instanceId) }));
  };

  const handleUpdatePortion = (meal, instanceId, newPortion) => {
    setDietPlan(prev => ({
      ...prev,
      [meal]: prev[meal].map(item => item.instanceId === instanceId ? { ...item, portion: newPortion } : item),
    }));
  };

  const handleSaveChart = async () => {
    if (!selectedPatient) return alert('Patient not selected.');
    if (Object.values(dietPlan).every(m => m.length === 0)) return alert('Please add at least one food item.');

    setIsLoading(true);
    try {
      const chartData = {
        patientId: selectedPatient._id,
        ...chartMetadata,
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
      alert('Error saving diet chart.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMealPlan = (plan, days) => {
    const meals = [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let i = 0; i < days; i++) {
      meals.push({
        day: `Day ${i + 1} (${daysOfWeek[i % 7]})`,
        breakfast: plan.breakfast.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'As per preference',
        lunch: plan.lunch.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'As per preference',
        dinner: plan.dinner.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'As per preference',
        snacks: plan.snacks.map(item => `${item.name} (${item.portion}g)`).join(', ') || 'Optional'
      });
    }
    return meals;
  };

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
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'plan':
        return <PlanEditor plan={dietPlan} onRemoveFood={handleRemoveFood} onUpdatePortion={handleUpdatePortion} />;
      case 'analytics':
        return <AnalyticsDashboard plan={dietPlan} />;
      case 'foods':
      default:
        return <FoodLibrary foods={foodDatabase} onAddFood={handleAddFood} />;
    }
  };

  return (
    <div id="app-view">
      <Header />
      <div className="creation-header">
        <div className="header-content">
          <div>
            <h1>Create New Diet Chart</h1>
            <p>{selectedPatient ? `For: ${selectedPatient.name}` : 'Loading patient...'}</p>
          </div>
          <div className="actions">
            <button onClick={() => navigate('/diet-chart')} className="btn-ghost">Cancel</button>
            <button onClick={handleSaveChart} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Diet Chart'}</button>
          </div>
        </div>
      </div>

      <main className="creation-main">
        <div className="chart-info-card">
          <h3>Chart Information</h3>
          <div className="form-grid-inputs">
            <div className="form-field">
              <label>Diagnosis</label>
              <input
                type="text"
                placeholder="e.g., Vata Imbalance, Digestive Issues"
                value={chartMetadata.diagnosis}
                onChange={(e) => setChartMetadata(prev => ({ ...prev, diagnosis: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>Duration (days)</label>
              <select
                value={chartMetadata.duration}
                onChange={(e) => setChartMetadata(prev => ({ ...prev, duration: e.target.value }))}
              >
                {[3, 7, 14, 21, 30].map(d => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            <div className="form-field full-width">
              <label>General Notes</label>
              <textarea
                placeholder="Special dietary instructions, allergies, preferences..."
                value={chartMetadata.notes}
                onChange={(e) => setChartMetadata(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <div className="nutrition-summary">
            <h4>Daily Nutrition Summary</h4>
            <div className="nutrition-stats-grid">
              <div className="nutrition-stat">
                <div className="value">{Math.round(totalNutrition.calories)}</div>
                <div className="label">Calories</div>
              </div>
              <div className="nutrition-stat">
                <div className="value">{Math.round(totalNutrition.carbs)}g</div>
                <div className="label">Carbs</div>
              </div>
              <div className="nutrition-stat">
                <div className="value">{Math.round(totalNutrition.protein)}g</div>
                <div className="label">Protein</div>
              </div>
              <div className="nutrition-stat">
                <div className="value">{Math.round(totalNutrition.fat)}g</div>
                <div className="label">Fat</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="tabs-wrapper">
          <div className="tab-navigation">
            <button className={`tab-button ${activeTab === 'foods' ? 'active' : ''}`} onClick={() => setActiveTab('foods')}>Foods</button>
            <button className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>Plan</button>
            <button className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
          </div>
          
          <div className="tab-content-area">
            {renderActiveTab()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NewDietChartCreationPage;