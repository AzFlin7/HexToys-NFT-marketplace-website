const mongoose = require('mongoose');

const soldSchema = new mongoose.Schema({
  id: { type: String, index: true }, 
  timestamp: {type: Number, index: true},
  year: {type: Number},
  month: {type: Number}, // 1 ~ 12
  day: {type: Number},
  itemCollection: {type: String, lowercase: true},
  tokenId: String,
  seller: {type: String, index: true, lowercase: true},
  buyer: {type: String, lowercase: true},
  tokenAdr: {type: String, lowercase: true},
  price: Number,
  amount: Number,

  usdPrice: {type: Number}, 
  usdVolume: {type: Number},
});

soldSchema.index({ itemCollection: 1, tokenId: 1});
soldSchema.index({ itemCollection: 1, timestamp: 1});
soldSchema.index({ tokenId: 1, itemCollection: 1, timestamp: 1, seller: 1});
soldSchema.index({ year: 1, month: 1, day: 1});

const Sold = mongoose.model('solds', soldSchema);
module.exports = Sold;
