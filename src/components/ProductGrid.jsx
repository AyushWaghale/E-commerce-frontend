import { Package } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="bg-card/60 backdrop-blur-sm rounded-2xl shadow-lg border border-border/30 p-16 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-muted/50 to-accent/50 rounded-full flex items-center justify-center">
            <Package className="text-muted-foreground" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No Products Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start building your inventory by adding your first product. Click the "Add New Product" button to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid; 