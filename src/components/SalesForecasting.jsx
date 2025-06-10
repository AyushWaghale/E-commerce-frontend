import React from 'react';
import { Line } from 'react-chartjs-2';
import { FaChartLine } from 'react-icons/fa';
import PredictButton from './prediction/PredictButton';
import PredictionModal from './prediction/PredictionModal';

const SalesForecasting = ({ product, predictionData, predictionLoading, predictionError, isModalOpen, getPrediction, closeModal, chartOptions }) => {
  const chartData = predictionData ? {
    labels: predictionData.dates,
    datasets: [
      {
        label: 'Predicted Sales',
        data: predictionData.predictions,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  } : null;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-primary mb-6">Sales Forecasting for {product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="text-green-500 mb-3"><FaChartLine size={40} /></div>
          <h2 className="text-lg font-semibold text-gray-700">Total Sales</h2>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="text-blue-500 mb-3"><FaChartLine size={40} /></div>
          <h2 className="text-lg font-semibold text-gray-700">Avg Monthly</h2>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="text-purple-500 mb-3"><FaChartLine size={40} /></div>
          <h2 className="text-lg font-semibold text-gray-700">Next 30 Days</h2>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Performance (Weekly)</h3>
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="text-center text-gray-500 py-10">No prediction data available. Upload a dataset to get predictions.</div>
        )}
        {predictionLoading && <p className="text-center text-blue-500">Loading prediction...</p>}
        {predictionError && <p className="text-center text-red-500">Error: {predictionError}</p>}
        <div className="mt-6 flex justify-center">
          <PredictButton onClick={() => getPrediction(product._id)} disabled={predictionLoading} />
        </div>
        <PredictionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          predictionData={predictionData}
          error={predictionError}
          loading={predictionLoading}
        />
      </div>
    </div>
  );
};

export default SalesForecasting; 