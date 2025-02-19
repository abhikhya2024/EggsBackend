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

app.post('/verifyOtp', async (req, res) => {
  const {mobile} = req.body;

  var result = await textflow.sendVerificationSMS(mobile);

  if (result.ok)
    //send sms here
    return res.status(200).json({success: true});

  return res.status(400).json({success: false});
});



