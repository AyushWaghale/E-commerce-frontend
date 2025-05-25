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

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts(); // Ensure product list is updated
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchData();
  }, [fetchProducts]);

  // Set current product after products are loaded
  useEffect(() => {
    if (!products || products.length === 0) return;

    const currentProduct = products.find(p => p._id === id);
    if (currentProduct) {
      setProduct({
        ...currentProduct,
        price: currentProduct.price.toString(),
        stock: currentProduct.stock.toString()
      });
    }
  }, [products, id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://e-commerce-backend-aeqi.onrender.com/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock, 10),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      await response.json();
      alert('Product updated successfully!');
      navigate(`/products/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Name', name: 'name' },
            { label: 'Category', name: 'category' },
            { label: 'Sub Category', name: 'subCategory' },
            { label: 'Price', name: 'price', type: 'number' },
            { label: 'Stock', name: 'stock', type: 'number' },
            { label: 'Brand', name: 'brand' }
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={product[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                required={['name', 'category', 'price', 'stock'].includes(name)}
                min={type === 'number' ? 0 : undefined}
                step={name === 'price' ? 0.01 : undefined}
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring focus:ring-blue-300"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
