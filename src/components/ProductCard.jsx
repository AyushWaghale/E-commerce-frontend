import React from "react";

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
    <img src={product.image} alt={product.name} className="w-full h-20 object-cover" />
    <div className="p-4">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-xs text-gray-400">{product.date}</p>
      <button className="mt-2 text-blue-600 hover:underline text-sm">View Details</button>
    </div>
  </div>
);

export default ProductCard;

