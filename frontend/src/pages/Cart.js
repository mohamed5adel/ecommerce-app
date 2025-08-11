import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setCheckoutLoading(true);
      
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress
      };

      const response = await api.post('/api/orders', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <button
          onClick={() => navigate('/products')}
          className="btn btn-primary text-lg px-8 py-3"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="card flex items-center space-x-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="form-input w-16 text-center"
                  />
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button
              onClick={clearCart}
              className="btn btn-danger"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            
            {user ? (
              <form onSubmit={handleCheckout} className="space-y-4">
                <h4 className="font-semibold">Shipping Address</h4>
                
                <input
                  type="text"
                  placeholder="Street Address"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                  className="form-input"
                  required
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="form-input"
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="form-input"
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="btn btn-primary w-full py-3 disabled:opacity-50"
                >
                  {checkoutLoading ? 'Processing...' : 'Checkout'}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please login to checkout</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary w-full"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
