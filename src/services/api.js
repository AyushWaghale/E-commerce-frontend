import axios from 'axios';

const API_URL = 'https://e-commerce-backend-aeqi.onrender.com';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
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

// Product APIs
export const productAPI = {
  getAllProducts: async () => {
    const response = await api.get('/api/products');
    return response.data;
  },

  addProduct: async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    const response = await api.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    
    const response = await api.post('/api/products/upload-dataset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api; 