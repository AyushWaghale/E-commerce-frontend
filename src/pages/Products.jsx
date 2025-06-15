import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import ProductGrid from '../components/ProductGrid';

const Products = () => {
  const { products, loading, error, fetchProducts, addProduct, deleteProduct } = useProducts();
  const { logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (productData) => {
    try {
      const result = await addProduct(productData);
      if (result && result._id) {
        setShowAddForm(false);
        fetchProducts();
        alert('Product added successfully!');
      } else {
        alert('Unexpected response. Please refresh the page.');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh] text-primary text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4 font-semibold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header with Glass Effect */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/20 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent tracking-tight">
                Product Management
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 font-semibold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                {showAddForm ? <X size={20} /> : <Plus size={20} />}
                {showAddForm ? 'Cancel' : 'Add New Product'}
              </span>
            </button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <ProductForm onSubmit={handleAddProduct} loading={loading} />
        )}

        {/* Products Grid */}
        <ProductGrid products={products} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Products;
