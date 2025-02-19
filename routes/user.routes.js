const express = require('express');
const router = express.Router();
const { register, matchOtp, createPin } = require('../controllers/user.controller'); // Import the controller

// @route   POST /api/auth/login
// @desc    Login user and get JWT token
// @access  Public
router.post('/register', register);
router.post('/matchOtp', matchOtp);
router.post('/createPin', createPin);

module.exports = router;

