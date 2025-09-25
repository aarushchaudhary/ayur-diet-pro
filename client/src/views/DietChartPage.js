import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PatientProfile from '../components/diet-chart/PatientProfile';
import FoodSearch from '../components/diet-chart/FoodSearch';
import RecipeBuilder from '../components/diet-chart/RecipeBuilder';
import DietPreview from '../components/diet-chart/DietPreview';


function DietChartPage() {
  // In a real app, you'd manage state here with useState/useReducer and Context API or Redux
  return (
    <div id="app-view">
      <Header />
      <main id="diet-chart-content">
        <div>
          <PatientProfile />
          <FoodSearch />
          <RecipeBuilder />
        </div>
        <DietPreview />
      </main>
      <Footer />
    </div>
  );
}

export default DietChartPage;