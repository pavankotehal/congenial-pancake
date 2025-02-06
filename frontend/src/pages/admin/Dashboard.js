import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-menu">
        <Link to="/admin/products" className="admin-menu-item">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="admin-menu-item">
          Manage Orders
        </Link>
        <Link to="/admin/users" className="admin-menu-item">
          Manage Users
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard; 