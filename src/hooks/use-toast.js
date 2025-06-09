import { useState, useEffect } from 'react';

// =======================
// Constants
// =======================

const TOAST_LIMIT = 1; // Maximum number of toasts at a time
const TOAST_REMOVE_DELAY = 3000; // Time before toast is automatically removed

/**
 * Generate a unique ID for each toast
 * @returns {string} A random unique ID
 */
function genId() {
  return Math.random().toString(36).substr(2, 9);
}

// =======================
// Action Types
// =======================

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

// =======================
// Toast Removal Queue
// =======================

const toastTimeouts = new Map();

/**
 * Schedule a toast for removal after a delay
 * @param {string} toastId - ID of the toast to remove
 */
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// =======================
// Reducer Function
// =======================

/**
 * Reducer function to manage the toast state
 * @param {Object} state - Current state of toasts
 * @param {Object} action - Action dispatched
 * @returns {Object} Updated state
 */
function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // Schedule removal
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
}

// =======================
// Toast State Management
// =======================

const listeners = [];
let memoryState = { toasts: [] };

/**
 * Dispatch function to update the toast state
 * @param {Object} action - Action to dispatch
 */
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// =======================
// Toast API
// =======================

/**
 * Creates and manages a toast notification
 * @param {Object} props - Toast properties
 * @returns {Object} Methods to update or dismiss the toast
 */
function toast(props) {
  const id = genId();

  const update = (updatedProps) => dispatch({
    type: actionTypes.UPDATE_TOAST,
    toast: { ...updatedProps, id },
  });

  const dismiss = () => dispatch({
    type: actionTypes.DISMISS_TOAST,
    toastId: id,
  });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: { ...props, id, open: true },
  });

  return { id, update, dismiss };
}

// =======================
// Custom Hook: useToast
// =======================

/**
 * Hook for managing toast notifications within components
 * @returns {Object} Methods for adding and removing toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  /**
   * Adds a toast notification
   * @param {Object} toast - Toast configuration
   */
  const addToast = (toast) => {
    const id = genId();
    setToasts((prev) => [...prev, { id, ...toast }]);

    // Auto remove after the specified duration or default delay
    setTimeout(() => removeToast(id), toast.duration || TOAST_REMOVE_DELAY);
  };

  /**
   * Removes a toast notification by ID
   * @param {string} id - Toast ID
   */
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

// =======================
// Exports
// =======================

export { toast };
