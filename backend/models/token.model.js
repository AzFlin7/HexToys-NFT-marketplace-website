const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  timestamp: {type: Number},
  address: {type: String, index: true, lowercase: true},
  name: String,
  symbol: String,
  decimal: Number,
  rate: Number // token USD rate
});

// tokenSchema.index({ timestamp: 1, address: 1 });
const Token = mongoose.model('tokens', tokenSchema);
module.exports = Token;
