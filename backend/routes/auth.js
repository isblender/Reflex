// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

const router = express.Router();

// Sign-up endpoint (POST /api/signup)
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if a user with the same username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Create new user
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint (POST /api/login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token using the secret from .env
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;