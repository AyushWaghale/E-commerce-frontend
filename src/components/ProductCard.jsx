import React from "react";

const ProductCard = ({ product }) => (
  <div className="bg-background-card rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
    <img src={product.image} alt={product.name} className="w-full h-20 object-cover" />
    <div className="p-4">
      <h2 className="text-lg font-bold text-text">{product.name}</h2>
      <p className="text-sm text-text-muted">{product.category}</p>
      <p className="text-xs text-text-muted">{product.date}</p>
      <button className="mt-2 text-primary hover:underline text-sm">View Details</button>
    </div>
  </div>
);

export default ProductCard;

