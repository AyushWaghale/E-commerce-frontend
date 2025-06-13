import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import usePrediction from '../hooks/usePrediction';
import PredictButton from '../components/prediction/PredictButton';
import { Line } from 'react-chartjs-2';
import { FaBoxes, FaChartLine, FaClipboardList } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import ProductDescription from '../components/ProductDescription';
import SalesForecasting from '../components/SalesForecasting';
import InventoryManagement from '../components/InventoryManagement';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datasetUploading, setDatasetUploading] = useState(false);
  const [datasetError, setDatasetError] = useState('');
  const [datasetSuccess, setDatasetSuccess] = useState('');
  const datasetInputRef = useRef();
  const [activeSection, setActiveSection] = useState('description'); // 'description', 'forecasting', 'inventory'
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'

  const {
    predictionData: rawPredictionData, // Rename to avoid conflict
    isLoading: predictionLoading,
    error: predictionError,
    getPrediction,
  } = usePrediction(id);

  // Helper to aggregate data weekly
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

  // Helper to aggregate data monthly
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
        // Push previous month's data
        monthlyPredictions.push(currentMonthSum);
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + monthStartIndex);
        monthlyDates.push(date.toISOString().split('T')[0]);

        // Reset for new month
        currentMonth = currentDate.getMonth();
        currentMonthSum = dailyPredictions[i];
        monthStartIndex = i;
      } else {
        currentMonthSum += dailyPredictions[i];
      }
    }
    // Push data for the last month
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

  const predictionData = getProcessedPredictionData(); // Use the processed data

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://e-commerce-backend-aeqi.onrender.com/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`https://e-commerce-backend-aeqi.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        navigate('/products');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDatasetUpload = async (e) => {
    e.preventDefault();
    setDatasetUploading(true);
    setDatasetError('');
    setDatasetSuccess('');
    const file = datasetInputRef.current.files[0];
    if (!file) {
      setDatasetError('Please select a file.');
      setDatasetUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append('dataset', file);
    formData.append('productId', product._id);
    try {
      const response = await fetch('https://e-commerce-backend-aeqi.onrender.com/api/products/upload-dataset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload dataset');
      const data = await response.json();
      setDatasetSuccess('Dataset uploaded successfully!');
      setProduct(data.product);
    } catch (err) {
      setDatasetError(err.message);
    } finally {
      setDatasetUploading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'description':
        return (
          <ProductDescription
            product={product}
            user={user}
            handleDelete={handleDelete}
            handleDatasetUpload={handleDatasetUpload}
            datasetInputRef={datasetInputRef}
            datasetUploading={datasetUploading}
            datasetError={datasetError}
            datasetSuccess={datasetSuccess}
          />
        );
      case 'forecasting':
        return (
          <SalesForecasting
            product={product}
            predictionData={predictionData}
            predictionLoading={predictionLoading}
            predictionError={predictionError}
            getPrediction={getPrediction}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        );
      case 'inventory':
        return (
          <InventoryManagement
            product={product}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-background text-text">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-primary hover:text-primary-dark transition duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      <div className="bg-background-card rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 md:flex">
        {/* Dashboard Navigation */}
        <div className="w-full md:w-64 bg-primary text-white p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Navigation</h2>
          <nav>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setActiveSection('description')}
                  className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200
                    ${activeSection === 'description' ? 'bg-primary-dark text-white shadow-md' : 'hover:bg-primary-dark'}`}
                >
                  <FaClipboardList className="mr-3" />
                  Product Description
                  
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('forecasting')}
                  className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200
                    ${activeSection === 'forecasting' ? 'bg-primary-dark text-white shadow-md' : 'hover:bg-primary-dark'}`}
                >
                  <FaChartLine className="mr-3" />
                  Sales Forecasting
                 
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('inventory')}
                  className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200
                    ${activeSection === 'inventory' ? 'bg-primary-dark text-white shadow-md' : 'hover:bg-primary-dark'}`}
                >
                  <FaBoxes className="mr-3" />
                  Inventory Management
                 
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-lg">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;