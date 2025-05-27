import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  LocalOffer as PriceIcon,
  Inventory as StockIcon,
  Description as DescriptionIcon,
  Business as BrandIcon
} from '@mui/icons-material';
import {
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

const Products = () => {
  const { products, loading, error, fetchProducts, addProduct, deleteProduct } = useProducts();
  const { logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }
  
    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        subCategory: newProduct.subCategory || '',
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        description: newProduct.description || '',
        brand: newProduct.brand || '',
        image: newProduct.image || null,
      };
  
      const result = await addProduct(productData);
  
      if (result && result._id) {
        setShowAddForm(false);
        setNewProduct({
          name: '',
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
        setSnackbarMessage('Product added successfully!');
        setSnackbarSeverity('success');
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setSnackbarMessage(error.response?.data?.message || 'Error adding product');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setSnackbarMessage('Product deleted successfully');
        setSnackbarSeverity('success');
        setShowSnackbar(true);
      } catch (error) {
        setSnackbarMessage('Error deleting product');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSnackbarMessage('Please select a valid image file');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
        e.target.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage('Image size should be less than 5MB');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
        e.target.value = '';
        return;
      }
      
      setNewProduct({ ...newProduct, image: file });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[40vh]">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text">Products</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <AddIcon /> Add Product
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.02 }}
              className="bg-background-card rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-text">{product.name}</h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product._id)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <DeleteIcon />
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="text-text-muted" />
                    <span className="text-text-muted">Image URL: {product.imageUrl}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="text-text-muted" />
                    <span className="text-text-muted">Category: {product.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="text-text-muted" />
                    <span className="text-text-muted">Subcategory: {product.subcategory}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriceIcon className="text-text-muted" />
                    <span className="text-text-muted">Price: ${product.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StockIcon className="text-text-muted" />
                    <span className="text-text-muted">Stock: {product.stock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DescriptionIcon className="text-text-muted" />
                    <span className="text-text-muted">Description: {product.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BrandIcon className="text-text-muted" />
                    <span className="text-text-muted">Brand: {product.brand}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background-card rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4 text-text">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-text-muted mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Subcategory</label>
                  <input
                    type="text"
                    name="subcategory"
                    value={newProduct.subCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-text-muted hover:text-text"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Add Product
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Products;