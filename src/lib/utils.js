/**
 * Utility function to merge class names dynamically.
 * Filters out falsy values and joins valid class names.
 * This is a simplified alternative to libraries like `clsx` or `tailwind-merge`.
 * 
 * @param {...string} inputs - Class names to merge
 * @returns {string} - Merged class names as a single string
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Truncates a given text to a specified length, appending an ellipsis if needed.
 * 
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum allowed length
 * @returns {string} - Truncated text with ellipsis if truncated
 */
export function truncateText(text, length) {
  return text.length <= length ? text : text.slice(0, length) + "...";
}

/**
 * Formats a rating value to one decimal place.
 * 
 * @param {number} rating - The rating value
 * @returns {number} - Formatted rating rounded to one decimal place
 */
export function formatRating(rating) {
  return Math.round(rating * 10) / 10;
}

/**
 * Predefined category-to-color mapping for Tailwind CSS classes.
 * Provides a background color and text color for different vendor categories.
 */
export const categoryColors = {
  "Car Wash": "bg-blue-500 text-white",
  "Home Cleaning": "bg-green-500 text-white",
  "General Store": "bg-yellow-500 text-gray-900",
  "Restaurant": "bg-red-500 text-white",
  "Electronics": "bg-purple-500 text-white",
  "default": "bg-gray-500 text-white"
};

/**
 * Returns the Tailwind class for a given category.
 * Falls back to the default color if the category is not listed.
 * 
 * @param {string} category - The category name
 * @returns {string} - Corresponding Tailwind CSS class
 */
export function getCategoryColor(category) {
  return categoryColors[category] || categoryColors.default;
}

// Constants
export const API_TIMEOUT = 10000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_DATASET_TYPES = ['text/csv', 'application/json'];

// Validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateFile = (file, maxSize = MAX_FILE_SIZE, allowedTypes = SUPPORTED_IMAGE_TYPES) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (file.size > maxSize) return { valid: false, error: 'File size exceeds limit' };
  if (!allowedTypes.includes(file.type)) return { valid: false, error: 'File type not supported' };
  return { valid: true };
};

// Format functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server';
  } else {
    // Other errors
    return error.message || 'An unexpected error occurred';
  }
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
