const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'user' // Default role
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email', 'password', 'role'] 
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Create token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with all required fields
    const responseData = {
      id: user.id,
      email: user.email,
      role: user.role,
      token: token
    };

    console.log('Sending login response:', { ...responseData, token: '[HIDDEN]' });
    res.json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Profile request for user ID:', req.user.id); // Debug log
    
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id', 'email', 'role']
    });

    console.log('Profile data:', user ? {
      id: user.id,
      email: user.email,
      role: user.role
    } : 'No user found'); // Debug log

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a test route to check user roles
router.get('/check-role', auth, (req, res) => {
  console.log('User from auth middleware:', req.user); // Debug log
  res.json({
    message: 'Current user role',
    role: req.user.role
  });
});

module.exports = router; 