const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./models/user.model');
const twilio = require('twilio');
const accountSid = 'AC4a73fcc11fbb8e53a6598899af7459a9';
const authToken = 'ec4d241a85b5144b74b9e44eec2e619e';
const client = twilio(accountSid, authToken);
const bcrypt = require('bcrypt');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

app.listen(port, () => {
  console.log('Server is running on port 8000');
});

mongoose
  .connect('mongodb+srv://abhikhya:ashi3666@cluster0.dyvke.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDb', err);
  });
app.post('/register', async (req, res) => {
  try {
    const {name, mobile, password, deviceId} = req.body;

    // Check if the mobile number is already registered
    const existingUser = await User.findOne({mobile});
    if (existingUser) {
      return res
        .status(400)
        .json({message: 'Mobile number already registered'});
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

    // Hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password and OTP
    const newUser = new User({
      name,
      mobile,
      password: hashedPassword,
      deviceId,
      otp,
      verificationToken: crypto.randomBytes(20).toString('hex'),
    });

    // Save the user to the database
    await newUser.save();
    console.log('New User Registered:', newUser);

    // Uncomment the following block if you are using Twilio
    /*
      try {
        const message = await client.messages.create({
          body: `Your verification code is: ${otp}`,
          from: '+16202582352', // Your Twilio number
          to: `+91${mobile}`, // Recipient's phone number with country code
        });
        console.log('SMS sent:', message.sid);
      } catch (smsError) {
        console.error('Error sending SMS:', smsError.message);
      }
      */

    // ✅ Ensure response is sent even if Twilio fails
    res.status(201).json({
      message:
        'Registration successful. Please check your phone for verification.',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res
      .status(500)
      .json({message: 'Registration failed', error: error.message});
  }
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
