import { useState } from 'react';
import PredictionChart from '../components/prediction/PredictionChart';
import PredictionForm from '../components/prediction/PredictionForm';

const PredictionPage = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getPrediction = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      // Log the request data
      console.log('Sending prediction request:', {
        url: 'http://localhost:5000/train_predict',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const response = await fetch('http://localhost:5000/train_predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      // Log the response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from server');
      }
      setPredictionData(data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrediction = (formData) => {
    getPrediction(formData);
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
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : predictionData ? (
              <div className="h-96">
                <PredictionChart predictionData={predictionData} />
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