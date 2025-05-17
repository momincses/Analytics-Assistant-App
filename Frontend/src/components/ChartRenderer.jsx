import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register chart types
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartRenderer = ({ config, data }) => {
  if (!config || !data || data.length === 0) {
    return <Typography variant="body2" color="text.secondary">No chart data available.</Typography>;
  }

  const labels = data.map((row) => row[config.xKey]);
 const datasets = [{
  label: config.yKey,
  data: data.map((row) => row[config.yKey]),
  backgroundColor: config.type === 'bar' ? 'rgba(0, 123, 255, 0.6)' : undefined,
  borderColor: config.type === 'line' ? 'rgba(0, 255, 180, 0.8)' : undefined,
  fill: config.type === 'line',
  tension: 0.4,
}];


  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: !!config.title,
        text: config.title,
        color: '#fff'
      }
    },
    scales: {
      x: {
        ticks: { color: '#ccc' },
        grid: { color: '#444' }
      },
      y: {
        ticks: { color: '#ccc' },
        grid: { color: '#444' }
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, backgroundColor: '#1e1e1e' }}>
      <Box>
        {config.type === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </Box>
    </Paper>
  );
};

export default ChartRenderer;
