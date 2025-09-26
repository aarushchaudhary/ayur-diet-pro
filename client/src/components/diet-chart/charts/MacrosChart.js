import React from 'react';
import Chart from 'react-apexcharts';

export default function MacrosChart({ data }) {
  const options = {
    chart: { id: 'macros-bar' },
    xaxis: { categories: ['Carbs', 'Protein', 'Fat'] },
    title: { text: 'Macros (per day)', align: 'left' },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } }
  };

  const series = [{
    name: 'grams',
    data: [Math.round(data.carbs), Math.round(data.protein), Math.round(data.fat)]
  }];

  return <Chart options={options} series={series} type="bar" height={250} />;
}