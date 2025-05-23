import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Products = () => {
  const { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subCategory: '',
    price: '',
    stock: '',
    description: '',
    brand: '',
    image: null,
    promotion: [],
    competitors: [],
    ratings: {
      average: 0,
      count: 0
    }
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all text fields
    Object.keys(newProduct).forEach(key => {
      if (key === 'image') {
        if (newProduct[key]) {
          formData.append('image', newProduct[key]);
        }
      } else if (key === 'ratings') {
        formData.append('ratings[average]', newProduct[key].average);
        formData.append('ratings[count]', newProduct[key].count);
      } else if (key === 'promotion' || key === 'competitors') {
        formData.append(key, JSON.stringify(newProduct[key]));
      } else {
        formData.append(key, newProduct[key]);
      }
    });

    const result = await addProduct(formData);
    if (result.success) {
      setShowAddForm(false);
      setNewProduct({
        name: '',
        category: '',
        subCategory: '',
        price: '',
        stock: '',
        description: '',
        brand: '',
        image: null,
        promotion: [],
        competitors: [],
        ratings: {
          average: 0,
          count: 0
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProduct} className="mb-8 p-4 bg-white rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Required Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <input
                  type="text"
                  placeholder="Sub Category"
                  value={newProduct.subCategory}
                  onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="Brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="border p-2 rounded w-full h-32"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-4">
              <span className="text-red-500">*</span> Required fields
            </p>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Product
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link to={`/products/${product._id}`}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-2">{product.category}</p>
                {product.subCategory && (
                  <p className="text-gray-600 mb-2">Sub Category: {product.subCategory}</p>
                )}
                <p className="text-2xl font-bold text-blue-600 mb-2">${product.price}</p>
                <p className="text-gray-600 mb-2">Stock: {product.stock}</p>
                {product.brand && (
                  <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
                )}
                {product.ratings && (
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
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
                      <span className="ml-2 text-sm text-gray-600">
                        ({product.ratings.count})
                      </span>
                    </div>
                  </div>
                )}
                {product.promotion && product.promotion.length > 0 && (
                  <div className="bg-green-100 p-2 rounded-lg mb-2">
                    <p className="text-green-800 text-sm">Active Promotion</p>
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <Link
                to={`/products/${product._id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 