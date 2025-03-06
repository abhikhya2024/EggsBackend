const express = require('express');
const router = express.Router();
const { createProduction, getProduction } = require('../controllers/production.controller'); // Import the controller

router.post('/createProduction', createProduction);
router.get("/production", getProduction);

module.exports = router;

