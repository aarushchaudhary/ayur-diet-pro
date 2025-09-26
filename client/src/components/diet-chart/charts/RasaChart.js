import React from 'react';
import Chart from 'react-apexcharts';

export default function RasaChart({ data }) {
  const options = {
    chart: { id: 'rasa-radar' },
    labels: ['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'],
    title: { text: 'Six Tastes (Rasa) Balance', align: 'left' },
    yaxis: {
      tickAmount: 4,
      labels: { formatter: val => Math.round(val) }
    }
  };
  const series = [{
    name: 'Taste Count',
    data: Object.values(data)
  }];

  return <Chart options={options} series={series} type="radar" height={300} />;
}