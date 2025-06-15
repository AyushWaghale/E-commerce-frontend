import React, { useState, useEffect } from 'react';
import { 
  FaLaptop, 
  FaChartLine, 
  FaPercent, 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaPlus, 
  FaTrash,
  FaChartBar,
  FaMoneyBillWave,
  FaHistory,
  FaGlobe,
  FaUsers,
  FaChartPie
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductDataForm = ({ productId, initialData, onSave, isLoading, error, success }) => {
  const navigate = useNavigate();

  // Define default structure for nested objects
  const defaultPromotion = {
    Competitor_promotion_effect: {},
    Old_promotion: [],
    Upcoming_promotion: [],
  };

  const defaultMarketDemand = {
    market_share: { 
      own: 0, 
      competitor: [] 
    },
    product_demand: {}
  };

  const defaultHistoricalData = {
    Ecommerce_platform_rating: [],
    Price_changes: {
      initial: 0,
      old: [],
      upcoming: []
    },
    Old_dataset_url: []
  };

  const defaultSeasonalTrends = {
    highest_demand_months: {}
  };

  const defaultEconomicIndicators = {
    gdp: {},
    unemployment_rate: {},
    inflation_rate: {},
    consumer_confidence_index: {},
    interest_rate: {},
    exchange_rate: {},
    stock_market_index: {}
  };

  const defaultCompetitorAnalysis = {
    competitors: []
  };

  const defaultPredictions = {
    accuracy: {},
    promotion_effect: {}
  };

  // Base structure for formData
  const baseFormDataStructure = {
    product_name: '',
    category: '',
    subCategory: '',
    start_date: '',
    end_date: '',
    discount: 0,
    price: 0,
    stock: 0,
    description: '',
    // imageUrl: '',
    brand: '',
    ratings: {
      average: 0,
      count: 0
    },
    datasetUrl: '',
    Dataset: {},
    market_demand: defaultMarketDemand,
    promotion: defaultPromotion,
    historical_data: defaultHistoricalData,
    seasonal_trends: defaultSeasonalTrends,
    economic_indicators: defaultEconomicIndicators,
    competitor_analysis: defaultCompetitorAnalysis,
    predictions: defaultPredictions
  };

  const [formData, setFormData] = useState(baseFormDataStructure);
  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', share: 0 });
  const [demandYears, setDemandYears] = useState([]);
  const [newYear, setNewYear] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [competitorShares, setCompetitorShares] = useState([]);
  const [newCompetitorShare, setNewCompetitorShare] = useState({ name: '', share: 0 });

  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        promotion: {
          ...defaultPromotion,
          ...initialData.promotion,
          Competitor_promotion_effect: {
            ...defaultPromotion.Competitor_promotion_effect,
            ...initialData.promotion?.Competitor_promotion_effect
          }
        },
        market_demand: {
          ...defaultMarketDemand,
          ...initialData.market_demand,
          market_share: {
            ...defaultMarketDemand.market_share,
            ...initialData.market_demand?.market_share,
            competitor: initialData.market_demand?.market_share?.competitor || []
          }
        }
      }));

      // Initialize competitors from existing data
      if (initialData.promotion?.Competitor_promotion_effect) {
        setCompetitors(Object.keys(initialData.promotion.Competitor_promotion_effect));
      }

      // Initialize demand years from existing data
      if (initialData.market_demand?.product_demand) {
        setDemandYears(Object.keys(initialData.market_demand.product_demand));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'market_share_own') {
      setFormData(prev => ({
        ...prev,
        market_demand: {
          ...prev.market_demand,
          market_share: {
            ...prev.market_demand.market_share,
            own: parseFloat(value) || 0
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  const handleCompetitorEffectChange = (competitor, value) => {
    setFormData(prev => ({
      ...prev,
      promotion: {
        ...prev.promotion,
        Competitor_promotion_effect: {
          ...prev.promotion.Competitor_promotion_effect,
          [competitor]: parseFloat(value)
        }
      }
    }));
  };

  const addCompetitor = () => {
    if (newCompetitor.name && !competitors.includes(newCompetitor.name)) {
      setCompetitors([...competitors, newCompetitor.name]);
      setFormData(prev => ({
        ...prev,
        promotion: {
          ...prev.promotion,
          Competitor_promotion_effect: {
            ...prev.promotion.Competitor_promotion_effect,
            [newCompetitor.name]: 0
          }
        },
        market_demand: {
          ...prev.market_demand,
          market_share: {
            ...prev.market_demand.market_share,
            competitor: [
              ...prev.market_demand.market_share.competitor,
              { name: newCompetitor.name, share: 0 }
            ]
          }
        }
      }));
      setNewCompetitor({ name: '', share: 0 });
    }
  };

  const removeCompetitor = (competitor) => {
    setCompetitors(competitors.filter(c => c !== competitor));
    setFormData(prev => {
      const newCompetitorEffect = { ...prev.promotion.Competitor_promotion_effect };
      delete newCompetitorEffect[competitor];
      
      return {
        ...prev,
        promotion: {
          ...prev.promotion,
          Competitor_promotion_effect: newCompetitorEffect
        },
        market_demand: {
          ...prev.market_demand,
          market_share: {
            ...prev.market_demand.market_share,
            competitor: prev.market_demand.market_share.competitor.filter(c => c.name !== competitor)
          }
        }
      };
    });
  };

  const handlePromotionChange = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      promotion: {
        ...prev.promotion,
        [type]: prev.promotion[type].map((promo, i) => 
          i === index ? { ...promo, [field]: value } : promo
        )
      }
    }));
  };

  const addPromotion = (type) => {
    setFormData(prev => ({
      ...prev,
      promotion: {
        ...prev.promotion,
        [type]: [...prev.promotion[type], { datetime: '', type: '' }]
      }
    }));
  };

  const removePromotion = (type, index) => {
    setFormData(prev => ({
      ...prev,
      promotion: {
        ...prev.promotion,
        [type]: prev.promotion[type].filter((_, i) => i !== index)
      }
    }));
  };

  const addDemandYear = () => {
    if (newYear && !demandYears.includes(newYear)) {
      setDemandYears([...demandYears, newYear]);
      setFormData(prev => ({
        ...prev,
        market_demand: {
          ...prev.market_demand,
          product_demand: {
            ...prev.market_demand.product_demand,
            [newYear]: []
          }
        }
      }));
      setNewYear('');
    }
  };

  const removeDemandYear = (year) => {
    setDemandYears(demandYears.filter(y => y !== year));
    setFormData(prev => {
      const newProductDemand = { ...prev.market_demand.product_demand };
      delete newProductDemand[year];
      return {
        ...prev,
        market_demand: {
          ...prev.market_demand,
          product_demand: newProductDemand
        }
      };
    });
  };

  const handleDemandDataChange = (year, value) => {
    setFormData(prev => ({
      ...prev,
      market_demand: {
        ...prev.market_demand,
        product_demand: {
          ...prev.market_demand.product_demand,
          [year]: value.split(',').map(Number).filter(n => !isNaN(n))
        }
      }
    }));
  };

  const addCompetitorShare = () => {
    if (newCompetitorShare.name && !competitorShares.some(cs => cs.name === newCompetitorShare.name)) {
      setCompetitorShares([...competitorShares, newCompetitorShare]);
      setFormData(prev => ({
        ...prev,
        market_demand: {
          ...prev.market_demand,
          market_share: {
            ...prev.market_demand.market_share,
            competitor: [
              ...prev.market_demand.market_share.competitor,
              { name: newCompetitorShare.name, share: newCompetitorShare.share }
            ]
          }
        }
      }));
      setNewCompetitorShare({ name: '', share: 0 });
    }
  };

  const removeCompetitorShare = (name) => {
    setCompetitorShares(competitorShares.filter(cs => cs.name !== name));
    setFormData(prev => ({
      ...prev,
      market_demand: {
        ...prev.market_demand,
        market_share: {
          ...prev.market_demand.market_share,
          competitor: prev.market_demand.market_share.competitor.filter(c => c.name !== name)
        }
      }
    }));
  };

  const handleBasicInfoChange = (e) => {
    const { name, value, type } = e.target;
    if (name.startsWith('ratings.')) {
      const ratingField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        ratings: {
          ...prev.ratings,
          [ratingField]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  const addEcommerceRating = () => {
    setFormData(prev => ({
      ...prev,
      historical_data: {
        ...prev.historical_data,
        Ecommerce_platform_rating: [
          ...prev.historical_data.Ecommerce_platform_rating,
          { month: '', rating: 0 }
        ]
      }
    }));
  };

  const handleEcommerceRatingChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      historical_data: {
        ...prev.historical_data,
        Ecommerce_platform_rating: prev.historical_data.Ecommerce_platform_rating.map((rating, i) => 
          i === index ? { ...rating, [field]: field === 'rating' ? parseFloat(value) : value } : rating
        )
      }
    }));
  };

  const addPriceChange = (type) => {
    setFormData(prev => ({
      ...prev,
      historical_data: {
        ...prev.historical_data,
        Price_changes: {
          ...prev.historical_data.Price_changes,
          [type]: [
            ...prev.historical_data.Price_changes[type],
            { datetime: '', price: 0, discount: 0 }
          ]
        }
      }
    }));
  };

  const handlePriceChange = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      historical_data: {
        ...prev.historical_data,
        Price_changes: {
          ...prev.historical_data.Price_changes,
          [type]: prev.historical_data.Price_changes[type].map((change, i) => 
            i === index ? { ...change, [field]: field === 'datetime' ? value : parseFloat(value) } : change
          )
        }
      }
    }));
  };

  const addDatasetUrl = () => {
    setFormData(prev => ({
      ...prev,
      historical_data: {
        ...prev.historical_data,
        Old_dataset_url: [
          ...prev.historical_data.Old_dataset_url,
          { Start: '', End: '', url: '' }
        ]
      }
    }));
  };

  const handleDatasetUrlChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      historical_data: {
        ...prev.historical_data,
        Old_dataset_url: prev.historical_data.Old_dataset_url.map((url, i) => 
          i === index ? { ...url, [field]: value } : url
        )
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(productId, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-background-card rounded-2xl shadow-xl p-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3">
          <FaLaptop className="text-primary" size={32} />
          <h2 className="text-3xl font-bold text-primary">Product Sales Data Form</h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 ${activeTab === 'basic' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Basic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('market')}
          className={`px-4 py-2 ${activeTab === 'market' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Market Data
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('historical')}
          className={`px-4 py-2 ${activeTab === 'historical' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Historical Data
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('economic')}
          className={`px-4 py-2 ${activeTab === 'economic' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Economic Data
        </button>
      </div>

      {/* Basic Information Section */}
      {activeTab === 'basic' && (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FaLaptop className="text-primary" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Basic Product Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700">Product Name:</span>
              <input 
                type="text" 
                name="product_name" 
                value={formData.product_name} 
                onChange={handleBasicInfoChange} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Category:</span>
              <input 
                type="text" 
                name="category" 
                value={formData.category} 
                onChange={handleBasicInfoChange} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Sub Category:</span>
              <input 
                type="text" 
                name="subCategory" 
                value={formData.subCategory} 
                onChange={handleBasicInfoChange} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Brand:</span>
              <input 
                type="text" 
                name="brand" 
                value={formData.brand} 
                onChange={handleBasicInfoChange} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Price ($):</span>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Stock:</span>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Discount (%):</span>
              <input 
                type="number" 
                name="discount" 
                value={formData.discount} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            {/* <label className="block">
              <span className="text-gray-700">Image URL:</span>
              <input 
                type="text" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label> */}
          </div>

          <label className="block">
            <span className="text-gray-700">Description:</span>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleBasicInfoChange}
              rows="3" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            ></textarea>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700">Start Date:</span>
              <input 
                type="date" 
                name="start_date" 
                value={formData.start_date} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">End Date:</span>
              <input 
                type="date" 
                name="end_date" 
                value={formData.end_date} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700">Average Rating:</span>
              <input 
                type="number" 
                step="0.1"
                name="ratings.average" 
                value={formData.ratings.average} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Rating Count:</span>
              <input 
                type="number" 
                name="ratings.count" 
                value={formData.ratings.count} 
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
              />
            </label>
          </div>
        </div>
      )}

      {/* Market Data Section */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          {/* Market Share Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FaChartPie className="text-primary" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Market Share</h3>
            </div>
            
            <div className="mb-4">
              <label className="block mb-4">
                <span className="text-gray-600">Own Share:</span>
                <input 
                  type="number" 
                  step="0.01" 
                  name="market_share_own"
                  value={formData.market_demand.market_share.own} 
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
                />
              </label>
              <div className="mb-4">
                <h5 className="text-md font-medium text-gray-600 mb-2">Competitor Share</h5>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                    placeholder="Competitor name"
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={newCompetitor.share}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, share: parseFloat(e.target.value) || 0 })}
                    placeholder="Share"
                    className="w-32 rounded-md border-gray-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={addCompetitor}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
                  >
                    Add Share
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.market_demand.market_share.competitor.map((comp, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-md">
                      <input 
                        type="text" 
                        value={comp.name} 
                        onChange={(e) => {
                          const newCompetitors = [...formData.market_demand.market_share.competitor];
                          newCompetitors[index] = { ...newCompetitors[index], name: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            market_demand: {
                              ...prev.market_demand,
                              market_share: {
                                ...prev.market_demand.market_share,
                                competitor: newCompetitors
                              }
                            }
                          }));
                        }}
                        placeholder="Competitor Name"
                        className="flex-1 rounded-md border-gray-300 shadow-sm" 
                      />
                      <input 
                        type="number" 
                        step="0.01" 
                        value={comp.share} 
                        onChange={(e) => {
                          const newCompetitors = [...formData.market_demand.market_share.competitor];
                          newCompetitors[index] = { 
                            ...newCompetitors[index], 
                            share: parseFloat(e.target.value) || 0 
                          };
                          setFormData(prev => ({
                            ...prev,
                            market_demand: {
                              ...prev.market_demand,
                              market_share: {
                                ...prev.market_demand.market_share,
                                competitor: newCompetitors
                              }
                            }
                          }));
                        }}
                        placeholder="Share"
                        className="w-32 rounded-md border-gray-300 shadow-sm" 
                      />
                      <button
                        type="button"
                        onClick={() => removeCompetitorShare(comp.name)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Demand Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-primary" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Product Demand</h3>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="Year (e.g., 2024)"
                  className="rounded-md border-gray-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={addDemandYear}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
                >
                  Add Year
                </button>
              </div>
            </div>
            {demandYears.map((year) => (
              <div key={year} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-md font-medium text-gray-600">{year} Data</h5>
                  <button
                    type="button"
                    onClick={() => removeDemandYear(year)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
                <input 
                  type="text" 
                  value={formData.market_demand.product_demand[year]?.join(',') || ''} 
                  onChange={(e) => handleDemandDataChange(year, e.target.value)} 
                  placeholder="Comma-separated monthly values"
                  className="w-full rounded-md border-gray-300 shadow-sm" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Data Section */}
      {activeTab === 'historical' && (
        <div className="space-y-6">
          {/* E-commerce Platform Rating */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaChartBar className="text-primary" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">E-commerce Platform Rating</h3>
              </div>
              <button
                type="button"
                onClick={addEcommerceRating}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
              >
                Add Rating
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.historical_data.Ecommerce_platform_rating.map((rating, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-md">
                  <input
                    type="text"
                    value={rating.month}
                    onChange={(e) => handleEcommerceRatingChange(index, 'month', e.target.value)}
                    placeholder="Month"
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={rating.rating}
                    onChange={(e) => handleEcommerceRatingChange(index, 'rating', e.target.value)}
                    placeholder="Rating"
                    className="w-32 rounded-md border-gray-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newRatings = formData.historical_data.Ecommerce_platform_rating.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        historical_data: {
                          ...prev.historical_data,
                          Ecommerce_platform_rating: newRatings
                        }
                      }));
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price Changes */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FaMoneyBillWave className="text-primary" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Price Changes</h3>
            </div>
            
            <div className="mb-4">
              <label className="block mb-4">
                <span className="text-gray-600">Initial Price:</span>
                <input
                  type="number"
                  value={formData.historical_data.Price_changes.initial}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      historical_data: {
                        ...prev.historical_data,
                        Price_changes: {
                          ...prev.historical_data.Price_changes,
                          initial: parseFloat(e.target.value) || 0
                        }
                      }
                    }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </label>
            </div>

            {/* Old Price Changes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-700">Old Price Changes</h4>
                <button
                  type="button"
                  onClick={() => addPriceChange('old')}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
                >
                  Add Old Price
                </button>
              </div>
              <div className="space-y-4">
                {formData.historical_data.Price_changes.old.map((change, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-md">
                    <input
                      type="datetime-local"
                      value={change.datetime}
                      onChange={(e) => handlePriceChange('old', index, 'datetime', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm"
                    />
                    <input
                      type="number"
                      value={change.price}
                      onChange={(e) => handlePriceChange('old', index, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-32 rounded-md border-gray-300 shadow-sm"
                    />
                    <input
                      type="number"
                      value={change.discount}
                      onChange={(e) => handlePriceChange('old', index, 'discount', e.target.value)}
                      placeholder="Discount"
                      className="w-32 rounded-md border-gray-300 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newChanges = formData.historical_data.Price_changes.old.filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          historical_data: {
                            ...prev.historical_data,
                            Price_changes: {
                              ...prev.historical_data.Price_changes,
                              old: newChanges
                            }
                          }
                        }));
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Price Changes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-700">Upcoming Price Changes</h4>
                <button
                  type="button"
                  onClick={() => addPriceChange('upcoming')}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
                >
                  Add Upcoming Price
                </button>
              </div>
              <div className="space-y-4">
                {formData.historical_data.Price_changes.upcoming.map((change, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-md">
                    <input
                      type="datetime-local"
                      value={change.datetime}
                      placeholder='Current Price'
                      onChange={(e) => handlePriceChange('upcoming', index, 'datetime', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm"
                    />
                    <input
                      type="number"
                      value={change.price}
                      onChange={(e) => handlePriceChange('upcoming', index, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-32 rounded-md border-gray-300 shadow-sm"
                    />
                    <input
                      type="number"
                      value={change.discount}
                      onChange={(e) => handlePriceChange('upcoming', index, 'discount', e.target.value)}
                      placeholder="Discount"
                      className="w-32 rounded-md border-gray-300 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newChanges = formData.historical_data.Price_changes.upcoming.filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          historical_data: {
                            ...prev.historical_data,
                            Price_changes: {
                              ...prev.historical_data.Price_changes,
                              upcoming: newChanges
                            }
                          }
                        }));
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Old Dataset URLs */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaHistory className="text-primary" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">Old Dataset URLs</h3>
              </div>
              <button
                type="button"
                onClick={addDatasetUrl}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
              >
                Add Dataset URL
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.historical_data.Old_dataset_url.map((url, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-md">
                  <input
                    type="date"
                    value={url.Start}
                    onChange={(e) => handleDatasetUrlChange(index, 'Start', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="date"
                    value={url.End}
                    onChange={(e) => handleDatasetUrlChange(index, 'End', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    value={url.url}
                    onChange={(e) => handleDatasetUrlChange(index, 'url', e.target.value)}
                    placeholder="Dataset URL"
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newUrls = formData.historical_data.Old_dataset_url.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        historical_data: {
                          ...prev.historical_data,
                          Old_dataset_url: newUrls
                        }
                      }));
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Economic Data Section */}
      {activeTab === 'economic' && (
        <div className="space-y-6">
          {/* Economic Indicators */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FaGlobe className="text-primary" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Economic Indicators</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GDP */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">GDP</h4>
                {demandYears.map((year) => (
                  <div key={year} className="mb-4">
                    <label className="block">
                      <span className="text-gray-600">{year} Data:</span>
                      <input
                        type="text"
                        value={formData.economic_indicators.gdp[year]?.join(',') || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            economic_indicators: {
                              ...prev.economic_indicators,
                              gdp: {
                                ...prev.economic_indicators.gdp,
                                [year]: e.target.value.split(',').map(Number).filter(n => !isNaN(n))
                              }
                            }
                          }));
                        }}
                        placeholder="Comma-separated values"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Unemployment Rate */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Unemployment Rate</h4>
                {demandYears.map((year) => (
                  <div key={year} className="mb-4">
                    <label className="block">
                      <span className="text-gray-600">{year} Data:</span>
                      <input
                        type="text"
                        value={formData.economic_indicators.unemployment_rate[year]?.join(',') || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            economic_indicators: {
                              ...prev.economic_indicators,
                              unemployment_rate: {
                                ...prev.economic_indicators.unemployment_rate,
                                [year]: e.target.value.split(',').map(Number).filter(n => !isNaN(n))
                              }
                            }
                          }));
                        }}
                        placeholder="Comma-separated values"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Inflation Rate */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Inflation Rate</h4>
                {demandYears.map((year) => (
                  <div key={year} className="mb-4">
                    <label className="block">
                      <span className="text-gray-600">{year} Data:</span>
                      <input
                        type="text"
                        value={formData.economic_indicators.inflation_rate[year]?.join(',') || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            economic_indicators: {
                              ...prev.economic_indicators,
                              inflation_rate: {
                                ...prev.economic_indicators.inflation_rate,
                                [year]: e.target.value.split(',').map(Number).filter(n => !isNaN(n))
                              }
                            }
                          }));
                        }}
                        placeholder="Comma-separated values"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Consumer Confidence Index */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Consumer Confidence Index</h4>
                {demandYears.map((year) => (
                  <div key={year} className="mb-4">
                    <label className="block">
                      <span className="text-gray-600">{year} Data:</span>
                      <input
                        type="text"
                        value={formData.economic_indicators.consumer_confidence_index[year]?.join(',') || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            economic_indicators: {
                              ...prev.economic_indicators,
                              consumer_confidence_index: {
                                ...prev.economic_indicators.consumer_confidence_index,
                                [year]: e.target.value.split(',').map(Number).filter(n => !isNaN(n))
                              }
                            }
                          }));
                        }}
                        placeholder="Comma-separated values"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Interest Rate */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Interest Rate</h4>
                {demandYears.map((year) => (
                  <div key={year} className="mb-4">
                    <label className="block">
                      <span className="text-gray-600">{year} Data:</span>
                      <input
                        type="text"
                        value={formData.economic_indicators.interest_rate[year]?.join(',') || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            economic_indicators: {
                              ...prev.economic_indicators,
                              interest_rate: {
                                ...prev.economic_indicators.interest_rate,
                                [year]: e.target.value.split(',').map(Number).filter(n => !isNaN(n))
                              }
                            }
                          }));
                        }}
                        placeholder="Comma-separated values"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Exchange Rate */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Exchange Rate</h4>
                {demandYears.map((year) => (
                  <div key={year} className="mb-4">
                    <label className="block">
                      <span className="text-gray-600">{year} Data:</span>
                      <input
                        type="text"
                        value={formData.economic_indicators.exchange_rate[year]?.join(',') || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            economic_indicators: {
                              ...prev.economic_indicators,
                              exchange_rate: {
                                ...prev.economic_indicators.exchange_rate,
                                [year]: e.target.value.split(',').map(Number).filter(n => !isNaN(n))
                              }
                            }
                          }));
                        }}
                        placeholder="Comma-separated values"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Stock Market Index */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Stock Market Index</h4>
                {demandYears.map((year) => (
                  <div key={year} className="mb-4">
                    <label className="block">
                      <span className="text-gray-600">{year} Data:</span>
                      <input
                        type="text"
                        value={formData.economic_indicators.stock_market_index[year]?.join(',') || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            economic_indicators: {
                              ...prev.economic_indicators,
                              stock_market_index: {
                                ...prev.economic_indicators.stock_market_index,
                                [year]: e.target.value.split(',').map(Number).filter(n => !isNaN(n))
                              }
                            }
                          }));
                        }}
                        placeholder="Comma-separated values"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
          {success}
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-8 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Sales Data'}
        </button>
      </div>
    </form>
  );
};

ProductDataForm.propTypes = {
  productId: PropTypes.string.isRequired,
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string
};

ProductDataForm.defaultProps = {
  initialData: null,
  isLoading: false,
  error: null,
  success: null
};

export default ProductDataForm; 