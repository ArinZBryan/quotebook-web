"use client"
import { ChartData } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Colors, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import autocolors from 'chartjs-plugin-autocolors';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, PointElement, LineElement, Tooltip, autocolors, CategoryScale, LinearScale );

export function DoughnutChart({data} : {data:ChartData<"doughnut", number[], unknown>}) {
    return <Doughnut data={data} options={{plugins: {
        autocolors: {
          mode: 'data',
        }
      }}} className='saturate-150 contrast-125'/>
}

export function LineChart({data} : {data:ChartData<"line", number[], unknown>}) {
  return <Line data={data} options={{
    plugins: {
      autocolors: {
        mode: 'dataset',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }} className='saturate-150 contrast-125'/>
}

export function BarChart({data} : {data:ChartData<"bar", number[], unknown>}) {
  return <Bar data={data} options={{
    plugins: {
      autocolors: {
        mode: 'data',
      }
    },
  }} className='saturate-150 contrast-125'/>
}