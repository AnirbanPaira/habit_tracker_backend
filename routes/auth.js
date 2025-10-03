const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Signup route with validation
router.post('/signup', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], signup);

// Login route with validation
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], login);

// Logout route
router.post('/logout', auth, (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  // Here we can just return success
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
