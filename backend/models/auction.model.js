const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  timestamp: {type: Number},
  auctionId: {type: Number},
  itemCollection: {type: String, lowercase: true},
  tokenId: String,
  startTime: {type: Number},
  endTime: {type: Number},
  tokenAdr: {type: String},
  startPrice: {type: Number},
  owner: {type: String, lowercase: true,},

  usdPrice: {type: Number},
});

auctionSchema.index({ tokenId: 1, itemCollection: 1, auctionId: 1});
auctionSchema.index({ tokenId: 1, itemCollection: 1, owner: 1});

const Auction = mongoose.model('auctions', auctionSchema);
module.exports = Auction;
