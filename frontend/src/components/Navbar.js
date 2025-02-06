import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Current user in Navbar:', user); // Debug log

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user && user.role === 'admin';
  console.log('Is admin?', isAdmin); // Debug log

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MAISON NOIR</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Collection</Link>
        {user && <Link to="/cart">Cart</Link>}
        
        {user ? (
          <>
            {isAdmin && (
              <div className="admin-links">
                <Link to="/admin" className="admin-link">Dashboard</Link>
                <Link to="/admin/products" className="admin-link">Inventory</Link>
                <Link to="/admin/products/add" className="admin-link">Add Product</Link>
              </div>
            )}
            <span className="user-info">
              <span className="user-email">{user.email}</span>
              {isAdmin && <span className="admin-badge">Admin</span>}
            </span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 