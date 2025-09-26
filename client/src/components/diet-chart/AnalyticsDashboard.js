import React, { useMemo } from 'react';
import MacrosChart from './charts/MacrosChart';
import ViryaChart from './charts/ViryaChart';
import RasaChart from './charts/RasaChart';

export default function AnalyticsDashboard({ plan }) {
  // Use useMemo to avoid re-calculating on every render
  const allFoodsInPlan = useMemo(() => Object.values(plan).flat(), [plan]);

  const analytics = useMemo(() => {
    const data = {
      macros: { carbs: 0, protein: 0, fat: 0 },
      virya: { Hot: 0, Cold: 0, Neutral: 0 },
      rasa: { Sweet: 0, Sour: 0, Salty: 0, Pungent: 0, Bitter: 0, Astringent: 0 },
    };

    allFoodsInPlan.forEach(food => {
      // Aggregate Macros
      data.macros.carbs += food.carbs;
      data.macros.protein += food.protein;
      data.macros.fat += food.fat;

      // Aggregate Virya
      if (data.virya[food.virya] !== undefined) {
        data.virya[food.virya]++;
      }
      
      // Aggregate Rasa
      food.rasa.forEach(r => {
        if (data.rasa[r] !== undefined) {
          data.rasa[r]++;
        }
      });
    });

    return data;
  }, [allFoodsInPlan]);

  return (
    <div className="column-container">
      <h3>Real-Time Analytics</h3>
      <MacrosChart data={analytics.macros} />
      <ViryaChart data={analytics.virya} />
      <RasaChart data={analytics.rasa} />
    </div>
  );
}