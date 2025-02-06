import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeader } from '../../config/api';
import './ProductManagement.css';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: ''
  });
  const [error, setError] = useState('');

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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      setNewProduct({
        name: '',
        description: '',
        price: '',
        image: '',
        stock: ''
      });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCT_DETAIL(productId), {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="product-management">
      <div className="header">
        <h2>Product Management</h2>
        <Link to="/admin/products/add" className="add-product-button">
          Add New Product
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="product-form">
        <h3>Add New Product</h3>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={newProduct.image}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>

      <div className="products-list">
        <h3>Current Products</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductManagement; 