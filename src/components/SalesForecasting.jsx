import React from 'react';
import { FaChartLine, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PredictButton from './prediction/PredictButton';
import PredictionChart from './prediction/PredictionChart';

const SalesForecasting = ({ product, predictionData, predictionLoading, predictionError, getPrediction, viewMode, setViewMode }) => {
  const navigate = useNavigate();
  
  // Check if product has necessary sales data for forecasting
  const hasSalesData = product && product.promotion && product.market_demand &&
                       (product.promotion.Old_promotion || product.promotion.Upcoming_promotion || product.promotion.Competitor_promotion_effect) &&
                       (product.market_demand.market_share || product.market_demand.product_demand);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-primary">Sales Forecasting for {product.product_name}</h1>
        <button
          onClick={() => navigate(`/products/${product._id}/sales-data`)}
          className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-medium overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center gap-2">
            <FaEdit size={18} />
            Update Product Data
          </span>
        </button>
      </div>
      {!hasSalesData ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
          Please fill out the <a href={`/products/${product._id}/sales-data`} className="font-bold underline">Product Sales Data Form</a> to enable sales forecasting.
        </div>
      ) : (
        <>
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
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Monthly
              </button>
            </div>
            <div style={{ height: '500px' }}> 
              <PredictionChart predictionData={predictionData} />
            </div>
            {predictionLoading && <p className="text-center text-blue-500">Loading prediction...</p>}
            {predictionError && <p className="text-center text-red-500">Error: {predictionError}</p>}
            <div className="mt-6 flex justify-center">
              <PredictButton onClick={() => getPrediction(product._id)} disabled={predictionLoading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesForecasting; 