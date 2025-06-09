// api.js
import axios from 'axios';

const API_URL = 'https://e-commerce-backend-aeqi.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (email, password) => {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
};

export const productAPI = {
  getAllProducts: async () => {
    const response = await api.get('/api/products');
    return response.data;
  },

  addProduct: async (productData) => {
    const formData = new FormData();

    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key]) {
        formData.append('image', productData[key]); // ✅ fixed field name
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, String(productData[key]));
      }
    });

    const response = await api.post('/api/products', formData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  uploadDataset: async (productId, datasetFile) => {
    const formData = new FormData();
    formData.append('dataset', datasetFile);
    formData.append('productId', productId);

    const response = await api.post('/api/products/upload-dataset', formData);
    return response.data;
  },
};

export default api;
