import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to Our E-Commerce Store
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Discover amazing products at great prices
      </p>
      <div className="space-x-4">
        <Link to="/products" className="btn btn-primary text-lg px-8 py-3">
          Browse Products
        </Link>
        <Link to="/register" className="btn btn-secondary text-lg px-8 py-3">
          Get Started
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-4">Easy Shopping</h3>
          <p className="text-gray-600">
            Browse through our extensive collection of products with ease
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-4">Secure Checkout</h3>
          <p className="text-gray-600">
            Safe and secure payment processing for all your purchases
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
          <p className="text-gray-600">
            Quick and reliable shipping to your doorstep
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
