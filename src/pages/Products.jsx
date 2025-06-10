import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Products = () => {
  const { products, loading, error, fetchProducts, addProduct, deleteProduct } = useProducts();
  const { logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    subCategory: '',
    description: '',
    brand: '',
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields (Name, Category, Price, Stock)');
      return;
    }
  
    try {
      const productData = {
        product_name: newProduct.name,
        category: newProduct.category,
        subCategory: newProduct.subCategory || '',
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        description: newProduct.description || '',
        brand: newProduct.brand || '',
        image: newProduct.image || null, // ✅ correct field name
      };
  
      const result = await addProduct(productData);
  
      if (result && result._id) {
        setShowAddForm(false);
        setNewProduct({
          product_name: '',
          category: '',
          price: '',
          stock: '',
          subCategory: '',
          description: '',
          brand: '',
          image: null,
        });
  
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
  
        fetchProducts();
        alert('Product added successfully!');
      } else {
        alert('Unexpected response. Please refresh the page.');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        alert(`Server Error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('Network error: Could not connect to server');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }
      
      setNewProduct({ ...newProduct, image: file });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh] text-primary text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4 font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-8 bg-background text-text">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-text">Products</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition"
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
  <div className="mb-10 max-w-3xl mx-auto bg-background-card rounded-2xl shadow-xl p-10 border border-background">
    <h2 className="text-2xl font-bold mb-6 text-primary text-center">Add New Product</h2>
    
    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Sub Category</label>
          <input
            type="text"
            placeholder="Sub Category"
            value={newProduct.subCategory}
            onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Brand</label>
          <input
            type="text"
            placeholder="Brand"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Description</label>
          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full px-4 py-2 h-28 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dark"
          />
          {newProduct.image && (
            <p className="text-sm text-green-600 mt-2">Selected: {newProduct.image.name}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="md:col-span-2 flex justify-end mt-6">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  </div>
)}


      {products.length === 0 ? (
        <div className="text-center text-text-muted py-20 text-lg font-medium">No products found. Start by adding a new product!</div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product._id} className="bg-background-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-background flex items-center justify-center">
                    <span className="text-text-muted">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-1 text-text hover:text-primary transition-colors">{product.name}</h2>
                <p className="text-text-muted mb-1">{product.category}</p>
                {product.subCategory && <p className="text-text-muted mb-1">Sub Category: {product.subCategory}</p>}
                <p className="text-2xl font-bold text-primary mb-1">${product.price}</p>
                <p className="text-text-muted mb-1">Stock: {product.stock}</p>
                {product.brand && <p className="text-text-muted mb-1">Brand: {product.brand}</p>}
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex-1"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/products/${product._id}`}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex-1 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;