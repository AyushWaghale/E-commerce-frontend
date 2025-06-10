import React, { useState, useEffect } from 'react';
import { FaLaptop, FaChartLine, FaPercent, FaCalendarAlt, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
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

  // Base structure for formData
  const baseFormDataStructure = {
    product_name: '',
    price: '',
    stock: '',
    description: '',
    promotion: defaultPromotion,
    market_demand: defaultMarketDemand,
  };

  const [formData, setFormData] = useState(baseFormDataStructure);
  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', share: 0 });
  const [demandYears, setDemandYears] = useState([]);
  const [newYear, setNewYear] = useState('');
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

      {/* Basic Product Info */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FaLaptop className="text-primary" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Basic Product Information</h3>
        </div>
        <label className="block">
          <span className="text-gray-700">Product Name:</span>
          <input 
            type="text" 
            name="product_name" 
            value={formData.product_name} 
            onChange={handleChange} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Price ($):</span>
          <input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Stock:</span>
          <input 
            type="number" 
            name="stock" 
            value={formData.stock} 
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description:</span>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="3" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          ></textarea>
        </label>
      </div>

      {/* Promotion Data */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaPercent className="text-primary" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Promotion Information</h3>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-700">Competitor Promotion Effects</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                placeholder="Competitor name"
                className="rounded-md border-gray-300 shadow-sm"
              />
              <button
                type="button"
                onClick={addCompetitor}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
              >
                Add Competitor
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {competitors.map((competitor) => (
              <div key={competitor} className="flex items-center gap-4 bg-white p-3 rounded-md">
                <span className="font-medium">{competitor}</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.promotion.Competitor_promotion_effect[competitor] || 0}
                  onChange={(e) => handleCompetitorEffectChange(competitor, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeCompetitor(competitor)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-700">Old Promotions</h4>
            <button 
              type="button" 
              onClick={() => addPromotion('Old_promotion')} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
            >
              Add Old Promotion
            </button>
          </div>
          {formData.promotion.Old_promotion.map((promo, index) => (
            <div key={index} className="flex space-x-2 mb-2 bg-white p-3 rounded-md">
              <input 
                type="datetime-local" 
                value={promo.datetime} 
                onChange={(e) => handlePromotionChange('Old_promotion', index, 'datetime', e.target.value)} 
                className="flex-1 rounded-md border-gray-300 shadow-sm" 
              />
              <input 
                type="text" 
                value={promo.type} 
                onChange={(e) => handlePromotionChange('Old_promotion', index, 'type', e.target.value)} 
                placeholder="Promotion type"
                className="flex-1 rounded-md border-gray-300 shadow-sm" 
              />
              <button 
                type="button" 
                onClick={() => removePromotion('Old_promotion', index)} 
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-700">Upcoming Promotions</h4>
            <button 
              type="button" 
              onClick={() => addPromotion('Upcoming_promotion')} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
            >
              Add Upcoming Promotion
            </button>
          </div>
          {formData.promotion.Upcoming_promotion.map((promo, index) => (
            <div key={index} className="flex space-x-2 mb-2 bg-white p-3 rounded-md">
              <input 
                type="datetime-local" 
                value={promo.datetime} 
                onChange={(e) => handlePromotionChange('Upcoming_promotion', index, 'datetime', e.target.value)} 
                className="flex-1 rounded-md border-gray-300 shadow-sm" 
              />
              <input 
                type="text" 
                value={promo.type} 
                onChange={(e) => handlePromotionChange('Upcoming_promotion', index, 'type', e.target.value)} 
                placeholder="Promotion type"
                className="flex-1 rounded-md border-gray-300 shadow-sm" 
              />
              <button 
                type="button" 
                onClick={() => removePromotion('Upcoming_promotion', index)} 
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Market Demand Data */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaChartLine className="text-primary" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Market Demand Information</h3>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Market Share</h4>
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
                value={newCompetitorShare.name}
                onChange={(e) => setNewCompetitorShare({ ...newCompetitorShare, name: e.target.value })}
                placeholder="Competitor name"
                className="flex-1 rounded-md border-gray-300 shadow-sm"
              />
              <input
                type="number"
                step="0.01"
                value={newCompetitorShare.share}
                onChange={(e) => setNewCompetitorShare({ ...newCompetitorShare, share: parseFloat(e.target.value) || 0 })}
                placeholder="Share"
                className="w-32 rounded-md border-gray-300 shadow-sm"
              />
              <button
                type="button"
                onClick={addCompetitorShare}
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

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-700">Product Demand</h4>
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