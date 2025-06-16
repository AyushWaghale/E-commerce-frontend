import { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
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
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InventoryForecast = ({ productId }) => {
  const [forecast, setForecast] = useState(null);
  const [inventoryInput, setInventoryInput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forecastData, inputData] = await Promise.all([
          inventoryAPI.getForecast(productId),
          inventoryAPI.getInventoryInput(productId)
        ]);
        setForecast(forecastData.forecast);
        setInventoryInput(inputData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!forecast || !inventoryInput) return null;

  const calculateMonthsUntilDepletion = () => {
    let remainingStock = inventoryInput.stockQuantity;
    let months = 0;

    for (const monthlyDemand of forecast.monthlyAggregates) {
      remainingStock -= monthlyDemand;
      if (remainingStock <= inventoryInput.reorderThreshold) {
        break;
      }
      months++;
    }

    return months;
  };

  const calculateYearlyStockNeeded = () => {
    const totalYearlyDemand = forecast.monthlyAggregates.reduce((sum, demand) => sum + demand, 0);
    const currentStockValue = inventoryInput.stockQuantity;
    const stockNeeded = Math.max(0, totalYearlyDemand - currentStockValue);
    return Math.ceil(stockNeeded);
  };

  const monthsUntilDepletion = calculateMonthsUntilDepletion();
  const yearlyStockNeeded = calculateYearlyStockNeeded();
  const totalYearlyDemand = Math.ceil(forecast.monthlyAggregates.reduce((sum, demand) => sum + demand, 0));

  // Prepare chart data
  const chartData = {
    labels: forecast.monthlyAggregates.map((_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Predicted Monthly Demand',
        data: forecast.monthlyAggregates,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
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
        text: 'Monthly Demand Forecast',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Cards */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Current Stock Status</h3>
            <p className="text-2xl font-bold text-blue-600">{inventoryInput.stockQuantity.toLocaleString()} units</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Stock Validity</h3>
            <p className="text-2xl font-bold text-green-600">
              {monthsUntilDepletion} months
            </p>
            <p className="text-sm text-green-600">
              until stock reaches reorder threshold ({inventoryInput.reorderThreshold.toLocaleString()} units)
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Reorder Recommendation</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {yearlyStockNeeded.toLocaleString()} units
            </p>
            <p className="text-sm text-yellow-600">
              needed for full year coverage
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Stock Status</h3>
            <p className="text-2xl font-bold text-purple-600">{forecast.stockStatus}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Stock Analysis Section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Stock Analysis</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800 mb-2">Current Stock Analysis</h4>
            <p className="text-gray-600">
              Your current stock of {inventoryInput.stockQuantity.toLocaleString()} units will last for approximately {monthsUntilDepletion} months 
              based on the predicted demand. The reorder threshold is set at {inventoryInput.reorderThreshold.toLocaleString()} units.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800 mb-2">Reorder Recommendation</h4>
            <p className="text-gray-600">
              To maintain optimal stock levels for the entire year, you should consider ordering 
              {yearlyStockNeeded.toLocaleString()} additional units. This recommendation is based on the total predicted 
              yearly demand of {totalYearlyDemand.toLocaleString()} units.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800 mb-2">Monthly Demand Pattern</h4>
            <p className="text-gray-600">
              The chart above shows the predicted monthly demand pattern. Peak demand periods are 
              highlighted in the detailed analysis below. Consider these patterns when planning your 
              reorder schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: forecast.analysis }}
        />
      </div>
    </div>
  );
};

export default InventoryForecast; 