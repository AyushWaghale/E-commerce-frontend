import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
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
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
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
      const response = await fetch('http://localhost:5000/api/products/upload-dataset', {
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
    <div className="container mx-auto px-4 py-8 bg-background text-text">
      <div className="bg-background-card rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-background flex items-center justify-center">
                <span className="text-text-muted">No image available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-text">{product.name}</h1>
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/products/${id}/edit`)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text">Category</h2>
                <p className="text-text-muted">{product.category}</p>
              </div>
              {product.subCategory && (
                <div>
                  <h2 className="text-lg font-semibold text-text">Sub Category</h2>
                  <p className="text-text-muted">{product.subCategory}</p>
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-text">Price</h2>
                <p className="text-text-muted">${product.price}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">Stock</h2>
                <p className="text-text-muted">{product.stock} units</p>
              </div>
              {product.brand && (
                <div>
                  <h2 className="text-lg font-semibold text-text">Brand</h2>
                  <p className="text-text-muted">{product.brand}</p>
                </div>
              )}
              {product.description && (
                <div>
                  <h2 className="text-lg font-semibold text-text">Description</h2>
                  <p className="text-text-muted">{product.description}</p>
                </div>
              )}
              {product.ratings && (
                <div>
                  <h2 className="text-lg font-semibold text-text">Ratings</h2>
                  <p className="text-text-muted">
                    Average: {product.ratings.average} ({product.ratings.count} reviews)
                  </p>
                </div>
              )}
            </div>

            {/* Dataset Upload Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text mb-4">Upload Dataset</h2>
              <form onSubmit={handleDatasetUpload} className="space-y-4">
                <input
                  type="file"
                  ref={datasetInputRef}
                  className="block w-full text-sm text-text-muted
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary-dark"
                />
                <button
                  type="submit"
                  disabled={datasetUploading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {datasetUploading ? 'Uploading...' : 'Upload Dataset'}
                </button>
                {datasetError && (
                  <p className="text-red-600">{datasetError}</p>
                )}
                {datasetSuccess && (
                  <p className="text-green-600">{datasetSuccess}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 