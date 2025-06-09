import { createContext, useContext, useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react";

// Create Toast Context
const ToastContext = createContext();

/**
 * ToastProvider - Provides toast notifications across the app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Wrapped child components
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Adds a new toast notification
   * @param {Object} toast - Toast properties
   * @param {string} toast.type - Type of toast ('success', 'error', 'warning')
   * @param {string} toast.message - Message to display
   * @param {number} [toast.duration=3000] - Auto-dismiss duration in ms (default: 3 sec)
   */
  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);

    // Auto-remove toast after specified duration
    const timeout = setTimeout(() => removeToast(id), toast.duration || 3000);

    // Store timeout reference in toast object
    return () => clearTimeout(timeout);
  };

  /**
   * Removes a toast notification by ID
   * @param {string} id - Toast ID to remove
   */
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Custom hook to access Toast Context
 * @returns {Object} Toast methods (addToast, removeToast) and current toasts
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
