import React, { useEffect, useState, useMemo } from 'react';
import { FaChartLine, FaEdit, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PredictButton from './prediction/PredictButton';
import PredictionChart from './prediction/PredictionChart';
import axios from 'axios';

const SalesForecasting = ({
  product,
  predictionData,
  predictionLoading,
  predictionError,
  getPrediction,
  viewMode,
  setViewMode,
}) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [fetchedPredictionData, setFetchedPredictionData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const hasSalesData =
    product &&
    product.promotion &&
    product.market_demand &&
    (product.promotion.Old_promotion ||
      product.promotion.Upcoming_promotion ||
      product.promotion.Competitor_promotion_effect) &&
    (product.market_demand.market_share || product.market_demand.product_demand);

  useEffect(() => {
    const fetchSavedPrediction = async () => {
      try {
        const response = await axios.get(
          `https://e-commerce-backend-aeqi.onrender.com/api/inventory/predict/${product._id}`
        );
        // Correctly access the forecast data from the API response
        if (response.data?.forecast) {
          setFetchedPredictionData(response.data.forecast);
        }
      } catch (err) {
        console.error('Error fetching saved prediction:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    if (product?._id && !predictionData) {
      fetchSavedPrediction();
    } else {
      setLoadingInitial(false);
    }
  }, [product?._id, predictionData]);

  // 🔄 Merge prediction data - handle both structures
  const finalPrediction = useMemo(() => {
    if (predictionData) {
      return predictionData;
    }
    if (fetchedPredictionData) {
      // Transform the fetched data to match the expected structure
      return {
        predictionData: fetchedPredictionData.predictionData || [],
        monthlyAggregates: fetchedPredictionData.monthlyAggregates || [],
        startDate: fetchedPredictionData.startDate,
        endDate: fetchedPredictionData.endDate,
        analysis: fetchedPredictionData.analysis,
        stockStatus: fetchedPredictionData.stockStatus
      };
    }
    return null;
  }, [predictionData, fetchedPredictionData]);

  console.log('Final prediction data:', finalPrediction);

  // ✅ Format chart data for PredictionChart component
  const chartData = useMemo(() => {
    if (!finalPrediction) return null;

    console.log('Processing finalPrediction for chartData:', finalPrediction);

    const startDate = new Date(finalPrediction.startDate || finalPrediction.start_date || new Date());
    let predictions = [];
    let dates = [];
    
    // Get the raw prediction data from different possible sources
    const rawData = finalPrediction.predictionData || 
                    finalPrediction.predictions || 
                    finalPrediction.output || 
                    [];
    
    console.log('Raw prediction data:', rawData);
    
    if (viewMode === 'monthly' && finalPrediction.monthlyAggregates && finalPrediction.monthlyAggregates.length > 0) {
      // Use monthly aggregates for monthly view
      predictions = finalPrediction.monthlyAggregates.map(value => parseFloat(value.toFixed(2)));
      dates = finalPrediction.monthlyAggregates.map((_, index) => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + index);
        return date.toISOString().split('T')[0];
      });
    } else if (rawData && rawData.length > 0) {
      // Use daily prediction data for daily/weekly view
      if (viewMode === 'daily') {
        // Show daily data
        predictions = rawData.map(value => parseFloat(value.toFixed(2)));
        dates = rawData.map((_, index) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + index);
          return date.toISOString().split('T')[0];
        });
      } else if (viewMode === 'weekly') {
        // Aggregate data weekly (7-day intervals)
        predictions = [];
        dates = [];
        for (let i = 0; i < rawData.length; i += 7) {
          const weekData = rawData.slice(i, i + 7);
          const weekAverage = weekData.reduce((sum, val) => sum + val, 0) / weekData.length;
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          
          predictions.push(parseFloat(weekAverage.toFixed(2)));
          dates.push(date.toISOString().split('T')[0]);
        }
      } else if (viewMode === 'monthly') {
        // If no monthly aggregates, create them from daily data
        predictions = [];
        dates = [];
        const daysInMonth = 30; // Approximate
        for (let i = 0; i < rawData.length; i += daysInMonth) {
          const monthData = rawData.slice(i, i + daysInMonth);
          const monthAverage = monthData.reduce((sum, val) => sum + val, 0) / monthData.length;
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          
          predictions.push(parseFloat(monthAverage.toFixed(2)));
          dates.push(date.toISOString().split('T')[0]);
        }
      }
    }

    console.log('Final chartData predictions:', predictions);
    console.log('Final chartData dates:', dates);

    // Return data in the format expected by PredictionChart
    return {
      predictions: predictions,
      dates: dates,
      start_date: finalPrediction.startDate || finalPrediction.start_date,
      end_date: finalPrediction.endDate || finalPrediction.end_date,
      analysis: finalPrediction.analysis
    };
  }, [finalPrediction, viewMode]);

  const handleSavePrediction = async () => {
    if (!predictionData) {
      setSaveError('No prediction data to save');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      let parsedAnalysis = '';
      try {
        if (predictionData.analysis) {
          const jsonString = predictionData.analysis.replace(/^json\s*/, '');
          const parsed = JSON.parse(jsonString);
          parsedAnalysis = parsed.response || '';
        }
      } catch (err) {
        console.error('Error parsing analysis:', err);
        // If parsing fails, use the raw analysis
        parsedAnalysis = predictionData.analysis || '';
      }

      const requestBody = {
        productId: product._id,
        prediction: {
          predictions: predictionData.predictions || predictionData.predictionData || [],
          start_date: predictionData.start_date || predictionData.startDate,
          end_date: predictionData.end_date || predictionData.endDate,
          analysis: parsedAnalysis,
          monthlyAggregates: predictionData.monthlyAggregates || [],
          stockStatus: predictionData.stockStatus || 'Unknown'
        },
      };

      const response = await axios.post(
        "https://e-commerce-backend-aeqi.onrender.com/api/inventory/predict",
        requestBody
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Prediction saved successfully');
        // Optionally refresh the fetched data
        setFetchedPredictionData(response.data.forecast || response.data);
      }
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Failed to save prediction');
      console.error('Error saving prediction:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-primary">
          Sales Forecasting for {product?.product_name || 'Product'}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleSavePrediction}
            disabled={saving || !predictionData}
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-500 disabled:opacity-50"
          >
            <FaSave className="inline-block mr-2" />
            {saving ? 'Saving...' : 'Save Prediction'}
          </button>
          <button
            onClick={() => navigate(`/products/${product._id}/sales-data`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-500"
          >
            <FaEdit className="inline-block mr-2" />
            Update Product Data
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{saveError}</div>
      )}

      {!hasSalesData ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded text-center">
          Please fill out the{' '}
          <a href={`/products/${product._id}/sales-data`} className="underline font-semibold">
            Product Sales Data Form
          </a>{' '}
          to enable sales forecasting.
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-6">
            {['daily', 'weekly', 'monthly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded ${
                  viewMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {mode[0].toUpperCase() + mode.slice(1)} View
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Prediction Chart ({viewMode} view)
              </h2>
              {finalPrediction?.stockStatus && (
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  finalPrediction.stockStatus === 'Sufficient' 
                    ? 'bg-green-100 text-green-800' 
                    : finalPrediction.stockStatus === 'Low'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Stock Status: {finalPrediction.stockStatus}
                </span>
              )}
            </div>

            {loadingInitial ? (
              <p className="text-blue-500 text-center">Loading saved prediction...</p>
            ) : chartData ? (
              <div>
                <PredictionChart predictionData={chartData} />
                <div className="mt-4 text-sm text-gray-600 text-center">
                  Showing {chartData.predictions?.length || 0} data points 
                  {finalPrediction?.startDate && finalPrediction?.endDate && (
                    <span>
                      {' '}from {new Date(finalPrediction.startDate).toLocaleDateString()} 
                      to {new Date(finalPrediction.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No prediction data available.</p>
            )}

            {predictionLoading && (
              <div className="text-center text-blue-500 py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  Generating prediction...
                </div>
              </div>
            )}
            
            {predictionError && (
              <div className="text-center text-red-500 py-4 bg-red-50 rounded">
                Error: {predictionError}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <PredictButton
                onClick={() => getPrediction(product._id)}
                disabled={predictionLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesForecasting;