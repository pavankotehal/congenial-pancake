import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loader"></div>
        <p>Curating our collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p>Error: {error}</p>
        <button onClick={fetchProducts} className="button-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="products-container fade-in">
      <div className="products-header">
        <h1>Luxury Footwear Collection</h1>
        <p>Discover our curated selection of premium shoes, crafted with excellence and designed for distinction.</p>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={product.image || 'https://via.placeholder.com/400x300?text=Premium+Footwear'}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Premium+Footwear';
                }}
              />
            </div>
            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <span className="product-stock">
                  {product.stock > 0 ? `${product.stock} Available` : 'Out of stock'}
                </span>
              </div>
              <button 
                className="add-to-cart-button"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products; 