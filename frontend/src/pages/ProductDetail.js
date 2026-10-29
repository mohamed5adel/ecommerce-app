import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.stock) {
      addToCart(product, quantity);
      toast.success(`${quantity} ${product.name} added to cart!`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>
          
          <p className="text-2xl font-bold text-blue-600 mb-4">
            ${product.price}
          </p>
          
          <p className="text-gray-600 mb-6">
            {product.description}
          </p>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Category</p>
            <span className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Stock</p>
            <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>
          
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="form-input w-24"
              />
            </div>
          )}
          
          <div className="space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary text-lg px-8 py-3 disabled:opacity-50"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button
              onClick={() => navigate('/products')}
              className="btn btn-secondary text-lg px-8 py-3"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
