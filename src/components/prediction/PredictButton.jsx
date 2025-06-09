const PredictButton = ({ onClick, isLoading, error }) => {
  return (
    <div className="mt-4">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Predicting...' : 'Predict Sales'}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default PredictButton; 