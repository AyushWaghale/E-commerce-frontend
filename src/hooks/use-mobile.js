import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current viewport is mobile
 * @returns {boolean} True if viewport width is less than 768px, otherwise false
 */
export function useIsMobile() {
  // State to track if the viewport is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    /**
     * Updates `isMobile` based on the current window width
     */
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Attach event listener on mount
    window.addEventListener('resize', checkIfMobile);

    // Cleanup function to remove event listener on unmount
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}
