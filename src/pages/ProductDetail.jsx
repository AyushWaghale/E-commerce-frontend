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
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
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
        setEditedProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedProduct)
      });
      if (!response.ok) throw new Error('Failed to update product');
      const data = await response.json();
      setProduct(data.product);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const handlePromotionChange = (idx, field, value) => {
    const updated = [...editedProduct.promotion];
    updated[idx][field] = value;
    setEditedProduct({ ...editedProduct, promotion: updated });
  };

  const addPromotion = () => {
    setEditedProduct({
      ...editedProduct,
      promotion: [
        ...editedProduct.promotion,
        { date: '', duration: '', area: '', platform: '' },
      ],
    });
  };

  const removePromotion = (idx) => {
    const updated = [...editedProduct.promotion];
    updated.splice(idx, 1);
    setEditedProduct({ ...editedProduct, promotion: updated });
  };

  const handleCompetitorChange = (idx, field, value) => {
    const updated = [...editedProduct.competitors];
    updated[idx][field] = value;
    setEditedProduct({ ...editedProduct, competitors: updated });
  };

  const addCompetitor = () => {
    setEditedProduct({
      ...editedProduct,
      competitors: [
        ...editedProduct.competitors,
        { price: '', discount: '', sales: '', marketShare: '' },
      ],
    });
  };

  const removeCompetitor = (idx) => {
    const updated = [...editedProduct.competitors];
    updated.splice(idx, 1);
    setEditedProduct({ ...editedProduct, competitors: updated });
  };

  const handleRatingsChange = (field, value) => {
    setEditedProduct({
      ...editedProduct,
      ratings: { ...editedProduct.ratings, [field]: value },
    });
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={editedProduct.category}
                    onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={editedProduct.price}
                    onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    value={editedProduct.stock}
                    onChange={(e) => setEditedProduct({ ...editedProduct, stock: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                  <input type="text" value={editedProduct.subCategory || ''} onChange={e => setEditedProduct({ ...editedProduct, subCategory: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input type="text" value={editedProduct.brand || ''} onChange={e => setEditedProduct({ ...editedProduct, brand: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea value={editedProduct.description || ''} onChange={e => setEditedProduct({ ...editedProduct, description: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input type="text" value={editedProduct.imageUrl || ''} onChange={e => setEditedProduct({ ...editedProduct, imageUrl: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-pink-600"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-full font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  {product.subCategory && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Sub Category:</span> {product.subCategory}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Stock:</span> {product.stock}
                  </p>
                  {product.brand && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Brand:</span> {product.brand}
                    </p>
                  )}
                  {product.description && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Description:</span> {product.description}
                    </p>
                  )}
                  {product.ratings && (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Rating:</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.ratings.average)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-gray-600">
                          ({product.ratings.count} reviews)
                        </span>
                      </div>
                    </div>
                  )}
                  {product.promotion && product.promotion.length > 0 && (
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800">Active Promotion</h3>
                      {product.promotion.map((promo, index) => (
                        <div key={index} className="mt-2">
                          <p className="text-green-700">
                            Platform: {promo.platform}
                          </p>
                          <p className="text-green-700">
                            Area: {promo.area}
                          </p>
                          <p className="text-green-700">
                            Duration: {promo.duration} days
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {product.competitors && product.competitors.length > 0 && (
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800">Competitor Information</h3>
                      {product.competitors.map((comp, index) => (
                        <div key={index} className="mt-2">
                          <p className="text-blue-700">
                            Price: ${comp.price}
                          </p>
                          <p className="text-blue-700">
                            Discount: {comp.discount}%
                          </p>
                          <p className="text-blue-700">
                            Sales: {comp.sales}
                          </p>
                          <p className="text-blue-700">
                            Market Share: {comp.marketShare}%
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-pink-600"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete Product
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 bg-gray-50 rounded-lg p-6 shadow-inner">
        <h3 className="text-xl font-bold mb-4 text-black">Upload Dataset</h3>
        <form onSubmit={handleDatasetUpload} className="flex flex-col md:flex-row items-center gap-4">
          <input type="file" ref={datasetInputRef} accept=".csv,.json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" className="border border-gray-300 rounded p-2" />
          <button type="submit" disabled={datasetUploading} className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-pink-600 transition-all">
            {datasetUploading ? 'Uploading...' : 'Upload Dataset'}
          </button>
        </form>
        {datasetError && <div className="text-red-500 mt-2">{datasetError}</div>}
        {datasetSuccess && <div className="text-green-600 mt-2">{datasetSuccess}</div>}
        {product.datasetUrl && (
          <div className="mt-2">
            <a href={product.datasetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Uploaded Dataset</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 