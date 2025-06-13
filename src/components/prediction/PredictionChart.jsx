import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PredictionChart = ({ predictionData }) => {
  if (
    !predictionData ||
    (!predictionData.predictions && !predictionData.output) ||
    (predictionData.predictions?.length === 0 && predictionData.output?.length === 0)
  ) {
    return <div className="text-center text-gray-500 py-10">No prediction data available.</div>;
  }

  // Normalize input data
  const predictions = predictionData.predictions || predictionData.output;
  const startDate = predictionData.start_date;

  const dates = predictionData.dates || (() => {
    if (!startDate) {
      return Array.from({ length: predictions.length }, (_, i) => `Day ${i + 1}`);
    }
    const baseDate = new Date(startDate);
    return Array.from({ length: predictions.length }, (_, i) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0]; // format as YYYY-MM-DD
    });
  })();

  // Calculate moving average and confidence intervals
  const calculateMovingAverage = (data, windowSize = 7) => {
    const result = [];
    const upperBound = [];
    const lowerBound = [];

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const end = i + 1;
      const slice = data.slice(start, end);

      const average = slice.reduce((a, b) => a + b, 0) / slice.length;
      result.push(average);

      const squaredDiffs = slice.map(value => Math.pow(value - average, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / slice.length;
      const stdDev = Math.sqrt(variance);

      const confidenceInterval = 1.96 * stdDev;
      upperBound.push(average + confidenceInterval);
      lowerBound.push(average - confidenceInterval);
    }

    return { average: result, upperBound, lowerBound };
  };

  const { average: movingAverage, upperBound, lowerBound } = calculateMovingAverage(predictions);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Sales',
        data: predictions,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 8,
        order: 2
      },
      {
        label: 'Trend Line',
        data: movingAverage,
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        order: 1
      },
      {
        label: 'Upper Bound',
        data: upperBound,
        borderColor: 'rgba(75, 192, 192, 0.2)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 1,
        fill: '+1',
        pointRadius: 0,
        order: 0
      },
      {
        label: 'Lower Bound',
        data: lowerBound,
        borderColor: 'rgba(75, 192, 192, 0.2)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        order: 0
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          filter: function (legendItem) {
            return legendItem.text === 'Daily Sales' || legendItem.text === 'Trend Line';
          }
        }
      },
      title: {
        display: true,
        text: 'Sales Prediction for Next 365 Days',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(2);
            if (label === 'Daily Sales') {
              return `${label}: ${value} units`;
            } else if (label === 'Trend Line') {
              return `${label}: ${value} units (avg)`;
            }
            return null;
          },
          title: function (context) {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.min(...predictions) * 0.9,
        max: Math.max(...predictions) * 1.1,
        title: {
          display: true,
          text: 'Sales (units)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          callback: function (value) {
            return value;
          },
          padding: 10
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
          padding: 10
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 8
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="h-full w-full bg-white rounded-lg shadow-lg p-4">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PredictionChart;
