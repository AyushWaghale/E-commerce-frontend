import { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context with default values
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

/**
 * ThemeProvider component that manages light/dark mode
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Wrapped child components
 */
export function ThemeProvider({ children }) {
  // Initialize dark mode based on localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Effect to sync theme changes with localStorage and document class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  /**
   * Toggles between light and dark mode
   */
  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context with `isDarkMode` and `toggleDarkMode`
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
