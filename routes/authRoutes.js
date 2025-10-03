const express = require('express');
const { check } = require('express-validator');
const { signup, login, signout, checkTokenBlacklist } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const signupValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Apply token blacklist check to all protected routes
router.use(checkTokenBlacklist);

// Auth routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/signout', auth, signout);

module.exports = router;
