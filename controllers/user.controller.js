const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import the crypto module

exports.register = async (req, res) => {
    // Log the body of the request for debugging
    console.log('Request Body:', req.body);

    try {
      const { name, mobile, password, deviceId } = req.body;

      // Check if the mobile number is already registered
      const existingUser = await User.findOne({ mobile });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'Mobile number already registered' });
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

      // ✅ Ensure response is sent even if Twilio fails
      res.status(201).json({
        message:
          'Registration successful. Please check your phone for verification.',
        userId: newUser._id,
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

exports.matchOtp=(async (req, res) => {
    const {otp} = req.body;
    console.log('otp', otp);
  
    const user = await User.findOne({otp});
    if (user) {
      return res.status(200).json({success: true, user});
    }
    console.log('myUser', user);
  
    return res.status(400).json({success: false});
  });
  
  exports.createPin=(async (req, res) => {
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