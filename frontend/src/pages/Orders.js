import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
        <p className="text-gray-600">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">
                  ${order.totalAmount}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Shipping Address:</h4>
              <p className="text-gray-600">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="space-y-2">
                {order.OrderItems?.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.Product?.imageUrl}
                        alt={item.Product?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.Product?.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
