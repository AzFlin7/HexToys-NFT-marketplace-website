const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  timestamp: {type: Number},
  itemCollection: {type: String, lowercase: true},
  tokenId: String, 
  auctionId: {type: Number, index: true},
  from: {type: String, lowercase: true,},
  tokenAdr: {type: String, lowercase: true},
  bidPrice: {type: Number, index: true},
});

const Bid = mongoose.model('bids', bidSchema);
module.exports = Bid;
