const express = require('express');
const router = express.Router();
const { createProduction } = require('../controllers/production.controller'); // Import the controller


router.post('/createProduction', createProduction);
module.exports = router;

