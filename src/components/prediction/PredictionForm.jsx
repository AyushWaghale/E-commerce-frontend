import { useState } from 'react';

const PredictionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    price: 4500,
    discount: 0.1,
    market_demand: {
      market_share: {
        own: 0.25,
        competitor: [
          { name: "Pioneer", share: 0.2 },
          { name: "Sony", share: 0.18 },
          { name: "Blaupunkt", share: 0.1 },
          { name: "Others", share: 0.27 }
        ]
      },
      product_demand: {
        current: 1000,
        growth_rate: 0.05
      },
      promotion_effect: {
        discount_impact: 0.15,
        seasonal_factors: {
          summer: 1.2,
          winter: 0.8,
          holiday: 1.5
        }
      }
    },
    historical_data: {
      sales: [100, 120, 115, 130, 125, 140, 135, 150, 145, 160, 155, 170],
      prices: [4500, 4600, 4550, 4700, 4650, 4800, 4750, 4900, 4850, 5000, 4950, 5100],
      promotions: [0, 0.1, 0, 0.15, 0, 0.2, 0, 0.25, 0, 0.3, 0, 0.35]
    },
    economic_indicators: {
      gdp_growth: 0.03,
      inflation_rate: 0.02,
      consumer_confidence: 0.75
    },
    competitor_analysis: {
      pricing_strategy: "competitive",
      market_position: "strong",
      product_quality: "high"
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Log the form data before submission
    console.log('Form data being submitted:', formData);
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount * 100}
            onChange={(e) => {
              const value = parseFloat(e.target.value) / 100;
              setFormData(prev => ({
                ...prev,
                discount: value
              }));
            }}
            step="1"
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Market Share (%)</label>
        <input
          type="number"
          name="market_share"
          value={formData.market_demand.market_share.own * 100}
          onChange={(e) => {
            const value = parseFloat(e.target.value) / 100;
            setFormData(prev => ({
              ...prev,
              market_demand: {
                ...prev.market_demand,
                market_share: {
                  ...prev.market_demand.market_share,
                  own: value
                }
              }
            }));
          }}
          step="1"
          min="0"
          max="100"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Predicting...' : 'Get Prediction'}
      </button>
    </form>
  );
};

export default PredictionForm; 