/**
 * Combines multiple class names into a single string.
 * Handles strings, numbers, arrays, and objects for dynamic class merging.
 * Inspired by `clsx` and `tailwind-merge`.
 *
 * @param  {...any} inputs - Class names, objects, or arrays to be combined
 * @returns {string} - A single string containing all valid class names
 */
export function cn(...inputs) {
  return inputs
    .filter(Boolean) // Remove falsy values like `null`, `undefined`, `false`
    .flatMap(input => {
      if (typeof input === 'string' || typeof input === 'number') {
        return input.toString(); // Convert numbers to strings
      }
      
      if (Array.isArray(input)) {
        return cn(...input); // Recursively process arrays
      }

      if (typeof input === 'object') {
        return Object.keys(input).filter(key => input[key]); // Include keys with truthy values
      }

      return ''; // Ignore unsupported types
    })
    .join(' '); // Join all valid class names into a single string
}
