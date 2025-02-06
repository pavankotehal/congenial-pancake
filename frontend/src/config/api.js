const API_BASE_URL = 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/orders`,
  MY_ORDERS: `${API_BASE_URL}/orders/my-orders`,
  ORDER_STATUS: (id) => `${API_BASE_URL}/orders/${id}/status`,
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 