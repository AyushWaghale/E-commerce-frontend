import React from 'react';
import { FaBoxes } from 'react-icons/fa';

const InventoryManagement = ({ product }) => {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-primary mb-6">Inventory Management for {product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="text-blue-500 mb-3"><FaBoxes size={40} /></div>
          <h2 className="text-lg font-semibold text-gray-700">Total Stock</h2>
          <p className="text-3xl font-bold text-gray-900">{product.stock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="text-green-500 mb-3"><FaBoxes size={40} /></div>
          <h2 className="text-lg font-semibold text-gray-700">Available</h2>
          <p className="text-3xl font-bold text-gray-900">{product.stock - (product.reserved || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="text-orange-500 mb-3"><FaBoxes size={40} /></div>
          <h2 className="text-lg font-semibold text-gray-700">Reserved</h2>
          <p className="text-3xl font-bold text-gray-900">{product.reserved || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="text-red-500 mb-3"><FaBoxes size={40} /></div>
          <h2 className="text-lg font-semibold text-gray-700">Low Stock</h2>
          <p className="text-3xl font-bold text-gray-900">{product.stock < product.reorderLevel ? 1 : 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Inventory by Location</h3>
        {product.locations && product.locations.length > 0 ? (
          product.locations.map((location, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h4 className="text-lg font-medium text-gray-700">{location.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Current Stock:</p>
                  <p className="font-bold text-gray-900">{location.currentStock} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reserved:</p>
                  <p className="font-bold text-gray-900">{location.reserved} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reorder Level:</p>
                  <p className="font-bold text-gray-900">{location.reorderLevel} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated:</p>
                  <p className="font-bold text-gray-900">{new Date(location.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(location.currentStock / location.capacity) * 100}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{((location.currentStock / location.capacity) * 100).toFixed(0)}% of max capacity</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No inventory locations defined.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement; 