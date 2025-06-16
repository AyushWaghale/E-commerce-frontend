import React, { useState, useEffect, useCallback } from 'react';
import { inventoryAPI } from '../services/api';
import { handleApiError } from '../lib/utils';

const InventoryForm = ({ productId, onSuccess }) => {
  const [formData, setFormData] = useState({
    productId,
    stockQuantity: '',
    reorderThreshold: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryNotFound, setInventoryNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [loading,setLoading]=useState('')

  const fetchInventoryData = useCallback(async () => {
    if (!productId) return;

    setInventoryNotFound(false);
    setErrors({});
    setFormData({
      productId,
      stockQuantity: '',
      reorderThreshold: '',
    });

    try {
      const result = await inventoryAPI.getInventoryInput(productId);
      const data = result?.data;

      if (data) {
        setFormData({
          productId: data.productId,
          stockQuantity: data.stockQuantity,
          reorderThreshold: data.reorderThreshold,
        });
        setInventoryNotFound(false);
        setShowForm(false);
      } else {
        setInventoryNotFound(true);
        setShowForm(true);
      }
    } catch (err) {
      if (err.originalError?.response?.status === 404) {
        setInventoryNotFound(true);
        setShowForm(true);
        setErrors({});
      } else {
        setErrors({ submit: handleApiError(err) });
      }
    }
  }, [productId]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  const validateForm = () => {
    const newErrors = {};
    const stock = parseFloat(formData.stockQuantity);
    const reorder = parseFloat(formData.reorderThreshold);

    if (isNaN(stock) || stock < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a non-negative number';
    }
    if (isNaN(reorder) || reorder < 0) {
      newErrors.reorderThreshold = 'Reorder threshold must be a non-negative number';
    }
    if (!isNaN(stock) && !isNaN(reorder) && reorder >= stock) {
      newErrors.reorderThreshold = 'Reorder threshold must be less than stock quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSavedMessage('');

    try {
      await inventoryAPI.updateInventory(formData.productId, parseFloat(formData.stockQuantity), parseFloat(formData.reorderThreshold));
      setInventoryNotFound(false);
      setShowForm(false);
      setSavedMessage('Inventory successfully saved!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (submitError) {
      setErrors({ submit: handleApiError(submitError) });
    } finally {
      setIsSubmitting(false);
    }
  };

 
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {inventoryNotFound && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Inventory Not Found!</strong>
          <p>Please fill in the inventory details below to create new inventory.</p>
        </div>
      )}

      {!inventoryNotFound && !showForm && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded relative">
          <p className="font-semibold">Inventory Data:</p>
          <ul className="list-disc pl-5 mt-1">
            <li><strong>Stock Quantity:</strong> {formData.stockQuantity}</li>
            <li><strong>Reorder Threshold:</strong> {formData.reorderThreshold}</li>
          </ul>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          {inventoryNotFound ? 'Create Inventory' : 'Update Inventory'}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.stockQuantity ? 'border-red-300' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Enter stock quantity"
              required
            />
            {errors.stockQuantity && (
              <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
            )}
          </div>

          <div>
            <label htmlFor="reorderThreshold" className="block text-sm font-medium text-gray-700">
              Reorder Threshold
            </label>
            <input
              type="number"
              id="reorderThreshold"
              name="reorderThreshold"
              value={formData.reorderThreshold}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.reorderThreshold ? 'border-red-300' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Enter reorder threshold"
              required
            />
            {errors.reorderThreshold && (
              <p className="mt-1 text-sm text-red-600">{errors.reorderThreshold}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {errors.submit}
            </div>
          )}

          {savedMessage && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded">
              {savedMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              inventoryNotFound ? 'Create Inventory' : 'Update Inventory'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default InventoryForm;
