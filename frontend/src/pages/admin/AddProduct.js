import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import debounce from 'lodash/debounce';
import './AddProduct.css';

function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Debounce the image preview update
  const debouncedUpdatePreview = useCallback(
    debounce((url) => {
      setPreviewImage(url);
    }, 500),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));

    // Only update preview for image URL changes
    if (name === 'image' && value) {
      debouncedUpdatePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      console.log('Submitting with token:', token); // Debug log
      console.log('Current user data:', userData); // Debug log

      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          image: product.image || null,
          stock: parseInt(product.stock)
        }),
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to add product');
      }

      setSuccess('Product added successfully!');
      setProduct({
        name: '',
        description: '',
        price: '',
        image: '',
        stock: ''
      });
      setPreviewImage('');

      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);

    } catch (err) {
      console.error('Error details:', err); // Debug log
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="error-container">Access denied. Admin only.</div>;
  }

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            placeholder="Enter product description"
            rows="4"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Price ($):</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="Enter price"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Image URL: (Optional)</label>
          <input
            type="url"
            name="image"
            value={product.image}
            onChange={handleChange}
            placeholder="Enter image URL (optional)"
            disabled={isLoading}
          />
          <small className="field-hint">Leave empty to use default product image</small>
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter stock quantity"
            disabled={isLoading}
          />
        </div>

        {previewImage && (
          <div className="preview">
            <h3>Image Preview</h3>
            <img 
              src={previewImage} 
              alt="Product preview" 
              className="preview-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
                e.target.onerror = null;
              }}
            />
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/admin/products')}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct; 