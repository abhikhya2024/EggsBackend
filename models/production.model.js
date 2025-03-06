const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now,
  },
  bird: {
    type: String,
    // required: true,
  },
  mortality: {
    type: String,
    // required: true,
  },
  lightState: {
    type: String,
  },
  feedWeight: {
    type: String,
  },
  eggCount: {
    type: Number,
  },
  smallEggCount: {
    type: Number,
  },
  damagedEggCount: {
    type: Number
  },
  temprature: {
    type: String
  },
  humidity: {
    type: String
  },
  gritsWeight: {
    type: String
  },
  suppliment: {
    type: String
  },
  medecine: {
    type: String
  },
  mobile: {
    type: Number
  },
  deviceId:{
    type: Number
  }
});

const Production = mongoose.model('Production', productionSchema);
module.exports = Production;
