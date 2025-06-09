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
