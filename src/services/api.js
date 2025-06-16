// api.js
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Environment-based API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-aeqi.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry logic
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log detailed error information
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      }
    });

    // Handle token refresh if 401 error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/api/auth/refresh-token', { refreshToken });
          const { token } = response.data;
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Handle other errors with more specific messages
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
    } else if (error.request) {
      errorMessage = 'No response received from server. Please check your internet connection.';
    } else {
      errorMessage = error.message || errorMessage;
    }
    
    console.error('API Error:', errorMessage);
    return Promise.reject(new APIError(errorMessage, error.response?.status, error.response?.data, error));
  }
);

// Custom error class for API errors
class APIError extends Error {
  constructor(message, status, data, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.originalError = originalError;
  }
}

// Helper function to handle API responses
const handleResponse = (response) => {
  if (response.data.success === false) {
    throw new APIError(response.data.message, response.status, response.data);
  }
  return response.data;
};

export const authAPI = {
  register: async (email, password, companyName) => {
    try {
      const response = await api.post('/api/auth/register', { email, password, companyName });
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Registration failed',
        error.response?.status,
        error.response?.data
      );
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const data = handleResponse(response);
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      }
      return data;
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Login failed',
        error.response?.status,
        error.response?.data
      );
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};

export const productAPI = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/api/products');
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to fetch products',
        error.response?.status,
        error.response?.data
      );
    }
  },

  addProduct: async (productData) => {
    try {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to add product',
        error.response?.status,
        error.response?.data
      );
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to update product',
        error.response?.status,
        error.response?.data
      );
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to delete product',
        error.response?.status,
        error.response?.data
      );
    }
  },

  uploadDataset: async (productId, datasetFile) => {
    try {
      const formData = new FormData();
      formData.append('dataset', datasetFile);
      formData.append('productId', productId);

      const response = await api.post('/api/products/upload-dataset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // You can use this to show upload progress
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to upload dataset',
        error.response?.status,
        error.response?.data
      );
    }
  },
};

export const inventoryAPI = {
  getForecast: async (productId) => {
    try {
      const response = await api.get(`/api/inventory/predict/${productId}`);
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to fetch inventory forecast',
        error.response?.status,
        error.response?.data
      );
    }
  },

  updateInventory: async (productId, stockQuantity, reorderThreshold) => {
    try {
      const response = await api.post(`/api/inventory/input`, { productId, stockQuantity, reorderThreshold });
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to update inventory',
        error.response?.status,
        error.response?.data
      );
    }
  },

  getInventoryInput: async (productId) => {
    try {
      const response = await api.get(`/api/inventory/input/${productId}`);
      return handleResponse(response);
    } catch (error) {
      throw new APIError(
        error.response?.data?.message || 'Failed to fetch inventory input',
        error.response?.status,
        error.response?.data
      );
    }
  }
};

export default api;
