import { useState } from 'react';
import PredictionChart from '../components/prediction/PredictionChart';
import PredictionForm from '../components/prediction/PredictionForm';
import usePrediction from '../hooks/usePrediction';

const PredictionPage = () => {
  const { predictionData: rawPredictionData, isLoading, error, getPrediction } = usePrediction();
  const [viewMode, setViewMode] = useState('daily');

  const aggregateWeekly = (data) => {
    const weeklyPredictions = [];
    const weeklyDates = [];
    if (!data || !data.predictions || data.predictions.length === 0) {
      return { predictions: [], dates: [] };
    }

    const dailyPredictions = data.predictions;
    const startDate = new Date(data.start_date || new Date());

    for (let i = 0; i < dailyPredictions.length; i++) {
      const weekIndex = Math.floor(i / 7);
      if (!weeklyPredictions[weekIndex]) {
        weeklyPredictions[weekIndex] = 0;
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (weekIndex * 7));
        weeklyDates[weekIndex] = date.toISOString().split('T')[0];
      }
      weeklyPredictions[weekIndex] += dailyPredictions[i];
    }
    return { predictions: weeklyPredictions, dates: weeklyDates };
  };

  const aggregateMonthly = (data) => {
    const monthlyPredictions = [];
    const monthlyDates = [];
    if (!data || !data.predictions || data.predictions.length === 0) {
      return { predictions: [], dates: [] };
    }

    const dailyPredictions = data.predictions;
    const startDate = new Date(data.start_date || new Date());

    let currentMonth = startDate.getMonth();
    let currentMonthSum = 0;
    let monthStartIndex = 0;

    for (let i = 0; i < dailyPredictions.length; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      if (currentDate.getMonth() !== currentMonth) {
        monthlyPredictions.push(currentMonthSum);
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + monthStartIndex);
        monthlyDates.push(date.toISOString().split('T')[0]);

        currentMonth = currentDate.getMonth();
        currentMonthSum = dailyPredictions[i];
        monthStartIndex = i;
      } else {
        currentMonthSum += dailyPredictions[i];
      }
    }
    if (currentMonthSum > 0) {
      monthlyPredictions.push(currentMonthSum);
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + monthStartIndex);
      monthlyDates.push(date.toISOString().split('T')[0]);
    }

    return { predictions: monthlyPredictions, dates: monthlyDates };
  };

  const getProcessedPredictionData = () => {
    if (!rawPredictionData) return null;

    switch (viewMode) {
      case 'weekly':
        return aggregateWeekly(rawPredictionData);
      case 'monthly':
        return aggregateMonthly(rawPredictionData);
      case 'daily':
      default:
        return rawPredictionData;
    }
  };

  const processedPredictionData = getProcessedPredictionData();

  const handlePrediction = (formData) => {
    getPrediction(formData.productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales Prediction</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Prediction Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Results</h2>
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
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : processedPredictionData ? (
              <div className="h-96">
                <PredictionChart predictionData={processedPredictionData} />
              </div>
            ) : (
              <div className="flex justify-center items-center h-96 text-gray-500">
                Submit the form to see prediction results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage; 