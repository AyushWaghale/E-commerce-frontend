import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PredictionChart = ({ predictionData }) => {
  // Generate dates for the x-axis (assuming predictions are for next 365 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < predictionData.length; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toLocaleDateString());
    }
    return dates;
  };

  const chartData = {
    labels: generateDates(),
    datasets: [
      {
        label: 'Predicted Sales',
        data: predictionData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Prediction for Next 365 Days',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Predicted Sales: ${context.parsed.y.toFixed(2)} units`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales (units)',
          font: {
            size: 14
          }
        },
        ticks: {
          callback: function(value) {
            return value.toFixed(0);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: 0, // Hide points to reduce visual clutter
        hitRadius: 10, // Keep hover functionality
        hoverRadius: 4 // Show points on hover
      }
    }
  };

  return (
    <div className="h-96 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PredictionChart; 