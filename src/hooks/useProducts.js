import { useState, useCallback } from 'react';
import { productAPI } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await productAPI.addProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return { success: true, product: newProduct };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const { product } = await productAPI.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p._id === id ? product : p));
      return { success: true, product };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await productAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const uploadDataset = async (productId, datasetFile) => {
    try {
      setLoading(true);
      setError(null);
      const { product } = await productAPI.uploadDataset(productId, datasetFile);
      setProducts(prev => prev.map(p => p._id === productId ? product : p));
      return { success: true, product };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload dataset';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadDataset,
  };
}; 