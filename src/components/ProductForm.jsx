import { useState } from 'react';
import { Package, Tag, DollarSign, Warehouse, Building, Image, Upload } from 'lucide-react';

const ProductForm = ({ onSubmit, loading }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    subCategory: '',
    description: '',
    brand: '',
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        e.target.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }
      
      setNewProduct({ ...newProduct, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields (Name, Category, Price, Stock)');
      return;
    }
  
    try {
      const productData = {
        product_name: newProduct.name,
        category: newProduct.category,
        subCategory: newProduct.subCategory || '',
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        description: newProduct.description || '',
        brand: newProduct.brand || '',
        image: newProduct.image || null,
      };
  
      await onSubmit(productData);
      
      // Reset form
      setNewProduct({
        name: '',
        category: '',
        price: '',
        stock: '',
        subCategory: '',
        description: '',
        brand: '',
        image: null,
      });
  
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        alert(`Server Error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('Network error: Could not connect to server');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="mb-12 max-w-5xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/30 overflow-hidden">
      <div className="bg-gradient-to-r from-primary via-accent to-primary/80 p-8 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-foreground/20 rounded-xl backdrop-blur-sm">
            <Package className="text-primary-foreground" size={28} />
          </div>
          <h2 className="text-2xl font-bold">Create New Product</h2>
        </div>
      </div>
      
      <div className="p-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Tag size={16} className="text-primary" />
                Product Name
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Package size={16} className="text-primary" />
                Category
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="Product category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <DollarSign size={16} className="text-primary" />
                Price
                <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Warehouse size={16} className="text-primary" />
                Stock Quantity
                <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Available stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Tag size={16} className="text-accent" />
                Sub Category
              </label>
              <input
                type="text"
                placeholder="Optional sub category"
                value={newProduct.subCategory}
                onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building size={16} className="text-accent" />
                Brand
              </label>
              <input
                type="text"
                placeholder="Product brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Package size={16} className="text-accent" />
                Description
              </label>
              <textarea
                placeholder="Detailed product description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-4 py-3 h-32 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 backdrop-blur-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Image size={16} className="text-accent" />
                Product Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-foreground file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-semibold file:bg-gradient-to-r file:from-primary file:to-accent file:text-primary-foreground hover:file:from-primary/80 hover:file:to-accent/80 file:shadow-lg file:transition-all file:duration-300 cursor-pointer border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors duration-300 bg-background/30 backdrop-blur-sm"
                />
              </div>
              {newProduct.image && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <p className="text-green-600 font-medium flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Selected: {newProduct.image.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-2 flex justify-end pt-6">
            <button
              type="submit"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary via-accent to-primary/80 text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-accent/80 to-primary/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                <Upload size={20} />
                {loading ? 'Creating Product...' : 'Create Product'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 