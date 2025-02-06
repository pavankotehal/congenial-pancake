const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const { Op } = require('sequelize');

const router = express.Router();

// Request password reset
router.post('/forgot', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000 // 1 hour
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: `Please click the following link to reset your password: ${resetUrl}`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    await user.update({
      password: req.body.password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 