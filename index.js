const express = require('express');

const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./models/user.model');
const twilio = require('twilio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const authRoutes = require('./routes/user.routes'); // Import auth routes
app.use('/api/auth', authRoutes); // Set up the auth routes

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

app.listen(port, () => {
  console.log('Server is running on port 8000');
});


  app.get('/users', async (req, res) => {
  
    const user = await User.find();
    if (user) {
      return res.status(200).json({success: true, user});
    }
    console.log('myUser', user);
  
    return res.status(400).json({success: false});
  });
  


app.post('/verify', async (req, res) => {
  const {mobile} = req.body;

  var result = await textflow.sendVerificationSMS(mobile);

  if (result.ok)
    //send sms here
    return res.status(200).json({success: true});

  return res.status(400).json({success: false});
});

app.post('/onPinLogin', async (req, res) => {
  try {
    const {pin, deviceId} = req.body;
    console.log('Pin:', pin, 'Device ID:', deviceId);
    // Check if the mobile is already registered
    const user = await User.findOne({pin: pin});
    console.log('User:', user);
    if (user) {
      // If passwords match, generate a session or JWT token, and respond to the user
      return res.status(200).json({success: true, message: 'Login successful'});
    } else {
      // If passwords don't match, return an error
      return res.status(400).json({success: false, message: 'Invalid pin'});
    }

    // Send verification SMS using Twilio
  } catch (error) {
    console.log('Error during login:', error); // Debugging statement
    res.status(500).json({message: 'Login failed'});
  }
});

app.post('/passwordLogin', async (req, res) => {
  try {
    const {password, deviceId} = req.body;
    console.log('Passowrd:', password, 'Device ID:', deviceId);
    // Check if the mobile is already registered
    const user = await User.findOne({deviceId: deviceId});
    console.log('user password', user.password);
    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res
          .status(200)
          .json({success: true, message: 'Login successful'});
      } else {
        return res
          .status(400)
          .json({success: false, message: 'Password is incorrect'});
      }
    } catch (error) {
      console.error('Error verifying password:', error);
    }

    // Send verification SMS using Twilio
  } catch (error) {
    console.log('Error during login:', error); // Debugging statement
    res.status(500).json({message: 'Login failed'});
  }
});

app.post('/verifyOtp', async (req, res) => {
  const {mobile} = req.body;

  var result = await textflow.sendVerificationSMS(mobile);

  if (result.ok)
    //send sms here
    return res.status(200).json({success: true});

  return res.status(400).json({success: false});
});

app.post('/matchOtp', async (req, res) => {
  const {otp} = req.body;
  console.log('otp', otp);

  const user = await User.findOne({otp});
  if (user) {
    return res.status(200).json({success: true, user});
  }
  console.log('myUser', user);

  return res.status(400).json({success: false});
});

app.post('/createPin', async (req, res) => {
  const {pin, deviceId} = req.body;
  if (!deviceId || !pin) {
    return res
      .status(400)
      .json({success: false, message: 'IMEI and pin are required'});
  }
  const user = await User.findOne({deviceId});

  if (user) {
    user.pin = pin;
    await user.save();
  }
  if (user) {
    return res.status(200).json({success: true, user});
  }
  return res.status(400).json({success: false});
});
