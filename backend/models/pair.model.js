const mongoose = require('mongoose');

const pairSchema = new mongoose.Schema({
  timestamp: {type: Number},
  pairId: {type: Number, index: true},
  itemCollection: {type: String, lowercase: true},
  tokenId: String,
  type: String,
  owner: {type: String, lowercase: true,},
  tokenAdr: {type: String, lowercase: true},
  balance: Number,
  price: Number,

  usdPrice: {type: Number, index: true}, //usd price 
});

pairSchema.index({ tokenId: 1, itemCollection: 1, owner: 1, pairId: 1});
pairSchema.index({ tokenId: 1, itemCollection: 1, pairId: 1, owner: 1});

const Pair = mongoose.model('pairs', pairSchema);

module.exports = Pair;
