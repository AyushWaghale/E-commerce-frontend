import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import usePrediction from '../hooks/usePrediction';
import PredictButton from '../components/prediction/PredictButton';
import PredictionModal from '../components/prediction/PredictionModal';
import { Line } from 'react-chartjs-2';
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

  const {
    predictionData,
    isLoading: predictionLoading,
    error: predictionError,
    isModalOpen,
    getPrediction,
    closeModal,
  } = usePrediction(id);

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

  const chartData = predictionData ? {
    labels: predictionData.dates,
    datasets: [
      {
        label: 'Predicted Sales',
        data: predictionData.predictions,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Prediction',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
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
      <div className="bg-background-card rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        <div className="md:flex flex-col md:flex-row gap-6">

          {/* Product Image */}
          <div className="md:w-1/2">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-l-2xl"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-extrabold text-primary">{product.name}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/products/${id}/edit`)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
              <div>
                <h2 className="font-semibold">Category</h2>
                <p className="text-text-muted">{product.category}</p>
              </div>
              {product.subCategory && (
                <div>
                  <h2 className="font-semibold">Sub Category</h2>
                  <p className="text-text-muted">{product.subCategory}</p>
                </div>
              )}
              <div>
                <h2 className="font-semibold">Price</h2>
                <p className="text-text-muted">${product.price}</p>
              </div>
              <div>
                <h2 className="font-semibold">Stock</h2>
                <p className="text-text-muted">{product.stock} units</p>
              </div>
              {product.brand && (
                <div>
                  <h2 className="font-semibold">Brand</h2>
                  <p className="text-text-muted">{product.brand}</p>
                </div>
              )}
              {product.ratings && (
                <div>
                  <h2 className="font-semibold">Ratings</h2>
                  <p className="text-text-muted">
                    {product.ratings.average} / 5 ({product.ratings.count} reviews)
                  </p>
                </div>
              )}
              {product.description && (
                <div className="col-span-full">
                  <h2 className="font-semibold">Description</h2>
                  <p className="text-text-muted">{product.description}</p>
                </div>
              )}
            </div>
            {/* Show uploaded dataset if available */}
            {product.datasetUrl && (
              <div className="mt-4 bg-gray-100 p-4 rounded-md flex items-center justify-between">
                <div className="text-text-muted truncate">
                  <span className="font-medium text-text">Uploaded Dataset: </span> 
                </div>
                <a
                  href={product.datasetUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Download
                </a>
              </div>
            )}

            {/* Prediction Button */}
            {product.datasetUrl && (
              <PredictButton
                onClick={getPrediction}
                isLoading={predictionLoading}
                error={predictionError}
              />
            )}

            {/* Dataset Upload Section */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-lg font-semibold mb-4">Upload Dataset</h2>
              <form onSubmit={handleDatasetUpload} className="space-y-4">
                <input
                  type="file"
                  ref={datasetInputRef}
                  className="block w-full text-sm text-text-muted
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary-dark transition"
                />
                <button
                  type="submit"
                  disabled={datasetUploading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {datasetUploading ? 'Uploading...' : 'Upload Dataset'}
                </button>
                {datasetError && (
                  <p className="text-red-600 text-sm">{datasetError}</p>
                )}
                {datasetSuccess && (
                  <p className="text-green-600 text-sm">{datasetSuccess}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Modal */}
      <PredictionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        predictionData={predictionData}
      />
    </div>
  );
};

export default ProductDetail; 