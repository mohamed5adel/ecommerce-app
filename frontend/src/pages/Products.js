import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(category && { category })
      });

      const response = await api.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const categories = ['Electronics', 'Accessories', 'Clothing', 'Books', 'Home'];

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input md:w-64"
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <p className="text-xl font-bold text-blue-600 mb-4">
              ${product.price}
            </p>
            <div className="flex space-x-2">
              <Link
                to={`/products/${product.id}`}
                className="btn btn-secondary flex-1 text-center"
              >
                View Details
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="btn btn-primary flex-1"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
