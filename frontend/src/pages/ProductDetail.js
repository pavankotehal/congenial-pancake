import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="product-detail">
      <h2>Product Details</h2>
      <div className="product-info">
        <img src={`/product${id}.jpg`} alt="Product" />
        <div className="product-content">
          <h3>Product {id}</h3>
          <p className="price">$99.99</p>
          <p className="description">
            Product description goes here...
          </p>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 