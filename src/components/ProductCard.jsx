import { Link } from 'react-router-dom';
import { Package, Tag, Warehouse, Building, Image } from 'lucide-react';

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="group bg-card/70 backdrop-blur-sm rounded-2xl shadow-lg border border-border/30 overflow-hidden hover:shadow-2xl hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
      <div className="relative overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-muted/50 to-accent/50 flex items-center justify-center">
            <Image className="text-muted-foreground group-hover:text-accent transition-colors duration-300" size={32} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 flex-1 flex flex-col space-y-3">
        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {product.product_name}
        </h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-primary" />
            <span className="text-muted-foreground">{product.category}</span>
          </div>
          
          {product.subCategory && (
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-accent" />
              <span className="text-muted-foreground">{product.subCategory}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Warehouse size={14} className="text-primary" />
            <span className="text-muted-foreground">{product.stock} units in stock</span>
          </div>
          
          {product.brand && (
            <div className="flex items-center gap-2">
              <Building size={14} className="text-accent" />
              <span className="text-muted-foreground">{product.brand}</span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <p className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ${product.price}
          </p>
        </div>

        <div className="mt-auto flex gap-3 pt-4">
          <button
            onClick={() => onDelete(product._id)}
            className="group relative px-4 py-2 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/80 to-destructive/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Delete</span>
          </button>
          <Link
            to={`/products/${product._id}`}
            className="group relative px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex-1 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

