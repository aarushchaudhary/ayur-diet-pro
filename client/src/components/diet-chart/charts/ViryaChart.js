import React from 'react';
import Chart from 'react-apexcharts';

export default function ViryaChart({ data }) {
  const options = {
    labels: ['Hot', 'Cold', 'Neutral'],
    title: { text: 'Food Properties (Virya)', align: 'left' }
  };
  const series = [data.Hot, data.Cold, data.Neutral];

  return <Chart options={options} series={series} type="donut" height={280} />;
}