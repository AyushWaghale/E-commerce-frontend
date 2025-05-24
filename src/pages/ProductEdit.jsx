import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProducts();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    subCategory: '',
    price: '',
    stock: '',
    description: '',
    brand: '',
    imageUrl: '',
    promotion: [],
    competitors: [],
    ratings: {
      average: 0,
      count: 0
    }
  });

  useEffect(() => {
    const fetchProduct = async () => {
      await fetchProducts();
      const currentProduct = products.find(p => p._id === id);
      if (currentProduct) {
        setProduct({
          ...currentProduct,
          price: currentProduct.price.toString(),
          stock: currentProduct.stock.toString()
        });
      }
    };
    fetchProduct();
  }, [id, fetchProducts, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://ecommerce-backend.onrender.com/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const result = await response.json();
      alert('Product updated successfully!');
      navigate(`/products/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sub Category</label>
            <input
              type="text"
              name="subCategory"
              value={product.subCategory}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="input w-full"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="input w-full"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="input w-full h-32"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit; 