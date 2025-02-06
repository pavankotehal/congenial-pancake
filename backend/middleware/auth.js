const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Received token:', token); // Debug log

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const user = await User.findOne({ where: { id: decoded.id } });
    console.log('Found user:', user ? user.toJSON() : null); // Debug log

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.error('Auth middleware error:', e); // Debug log
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    console.log('Checking admin role for user:', req.user.toJSON()); // Debug log
    
    if (!req.user) {
      throw new Error('No user found in request');
    }

    if (req.user.role !== 'admin') {
      console.log('User role is not admin:', req.user.role); // Debug log
      return res.status(403).send({ error: 'Admin access required.' });
    }

    console.log('Admin access granted'); // Debug log
    next();
  } catch (e) {
    console.error('Admin middleware error:', e); // Debug log
    res.status(403).send({ error: 'Admin access required.' });
  }
};

module.exports = { auth, isAdmin }; 