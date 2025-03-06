const Production = require('../models/production.model');
const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import the crypto module

exports.createProduction = async (req, res) => {
  console.log('Request Body:', req.body);
  
  try {
      const { createdDate, bird, mortality, lightState, feedWeight, eggCount, 
          smallEggCount, damagedEggCount, temprature, humidity, gritsWeight, 
          suppliment, medecine, deviceId, mobile } = req.body;

      const user = await User.findOne({ mobile, deviceId });

      if (user) {
          const prodData = new Production({ // ⬅ Change `User` to `Production`
              createdDate, bird, mortality, lightState, feedWeight, eggCount, 
              smallEggCount, damagedEggCount, temprature, humidity, gritsWeight, 
              suppliment, medecine, mobile, deviceId
          });

          const response = await prodData.save();
          console.log('Production data added:', response);

          res.status(200).json({ success: true, message: "Data added successfully" });
      } else {
          res.status(400).json({ success: false, message: "Device does not exist" });
      }
  } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getProduction=(async (req, res) => {
    const {mobile, deviceId} = req.body;
    if (!mobile || !deviceId) {
      return res
        .status(400)
        .json({success: false, message: 'Mobile number and device ids are required'});
    }
    const productionData = await Production.findOne({mobile, deviceId});
    if (productionData) {
      return res.status(200).json({success: true, production: productionData, message: "Production dat a fetched successfully"});
    }
    return res.status(400).json({success: false, deviceId: null, message: "Device id does not exist"});
  });
