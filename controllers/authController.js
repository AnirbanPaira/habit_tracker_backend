const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Token blacklist to store invalidated tokens
const tokenBlacklist = new Set();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Signup
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Signout
const signout = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Add the token to the blacklist
      tokenBlacklist.add(token);
    }

    res.json({
      success: true,
      message: 'Successfully signed out'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Middleware to check if token is blacklisted
const checkTokenBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({
      success: false,
      error: 'Token is invalid'
    });
  }
  
  next();
};

module.exports = { signup, login, signout, checkTokenBlacklist };
