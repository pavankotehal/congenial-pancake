import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div className="error-container">Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-cards">
        <div className="admin-card">
          <h2>Products</h2>
          <div className="card-actions">
            <Link to="/admin/products" className="admin-button">
              Manage Products
            </Link>
            <Link to="/admin/products/add" className="admin-button">
              Add New Product
            </Link>
          </div>
        </div>

        <div className="admin-card">
          <h2>Orders</h2>
          <div className="card-actions">
            <Link to="/admin/orders" className="admin-button">
              View Orders
            </Link>
          </div>
        </div>

        <div className="admin-card">
          <h2>Users</h2>
          <div className="card-actions">
            <Link to="/admin/users" className="admin-button">
              Manage Users
            </Link>
          </div>
        </div>

        <div className="admin-card">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Products</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 