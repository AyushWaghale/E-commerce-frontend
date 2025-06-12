import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDataForm from '../components/ProductDataForm.jsx';

const ProductSalesData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Define default structures for nested objects
  const defaultPromotion = {
    Competitor_promotion_effect: { Dell: 0, Lenovo: 0 },
    Old_promotion: [],
    Upcoming_promotion: [],
  };

  const defaultMarketDemand = {
    market_share: { own: 0.3, competitor: [{ name: 'Dell', share: 0.2 }, { name: 'Lenovo', share: 0.1 }] },
    product_demand: { '2018': [], '2019': [] },
  };

  // Helper function to build initial data with default structures
  const buildInitialData = (productData) => ({
    product_name: productData?.product_name || '',
    price: productData?.price || '',
    stock: productData?.stock || '',
    category: productData?.category || '',
    brand: productData?.brand || '',
    description: productData?.description || '',
    promotion: {
      ...defaultPromotion,
      ...(productData?.promotion || {}),
      Competitor_promotion_effect: {
        ...defaultPromotion.Competitor_promotion_effect,
        ...(productData?.promotion?.Competitor_promotion_effect || {}),
      },
      Old_promotion: productData?.promotion?.Old_promotion || [],
      Upcoming_promotion: productData?.promotion?.Upcoming_promotion || [],
    },
    market_demand: {
      ...defaultMarketDemand,
      ...(productData?.market_demand || {}),
      market_share: {
        ...defaultMarketDemand.market_share,
        ...(productData?.market_demand?.market_share || {}),
        competitor: productData?.market_demand?.market_share?.competitor
          ? productData.market_demand.market_share.competitor.map(comp => ({
              name: comp.name || '', // Ensure competitor name is not undefined
              share: comp.share || 0, // Ensure competitor share is not undefined
            }))
          : defaultMarketDemand.market_share.competitor,
      },
      product_demand: {
        ...defaultMarketDemand.product_demand,
        ...(productData?.market_demand?.product_demand || {}),
      },
    },
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`https://e-commerce-backend-aeqi.onrender.com/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleSaveSalesData = async (productId, formData) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const response = await fetch(`https://e-commerce-backend-aeqi.onrender.com/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save sales data');
      }

      setSaveSuccess('Sales data saved successfully!');
      // Optionally navigate back or update product detail page
      // navigate(`/products/${productId}`);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading product data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center p-4">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-text">
      <ProductDataForm
        productId={id}
        initialData={buildInitialData(product)}
        onSave={handleSaveSalesData}
        isLoading={isSaving}
        error={saveError}
        success={saveSuccess}
      />
    </div>
  );
};

export default ProductSalesData; 