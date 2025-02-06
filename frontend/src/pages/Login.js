import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Create user info object from the direct response
      const userInfo = {
        id: data.id,
        email: data.email,
        role: data.role,
        token: data.token
      };

      // Verify we have all required fields
      if (!userInfo.id || !userInfo.email || !userInfo.role || !userInfo.token) {
        console.error('Missing required user data:', userInfo);
        throw new Error('Invalid response data');
      }

      console.log('Processed user info:', userInfo); // Debug log

      // Clear existing data
      localStorage.clear();
      
      // Store new data
      localStorage.setItem('token', userInfo.token);
      localStorage.setItem('user', JSON.stringify(userInfo));

      // Update auth context
      login(userInfo);
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.message || 'An error occurred during login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 