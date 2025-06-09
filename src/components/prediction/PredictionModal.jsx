import PredictionChart from './PredictionChart';

const PredictionModal = ({ isOpen, onClose, predictionData }) => {
  if (!isOpen || !predictionData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sales Prediction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <PredictionChart predictionData={predictionData} />
        <div className="mt-4 text-sm text-gray-600">
          <p>Prediction confidence: {predictionData.confidence}%</p>
          <p>Next 30 days forecast</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal; 