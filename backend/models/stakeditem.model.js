const mongoose = require('mongoose');

const stakeditemSchema = new mongoose.Schema({
  id: {type: String, index: true}, // stakingAddress-owner-tokenId
  timestamp: {type: Number, index: true}, //
  owner: {type: String, index: true, lowercase: true}, //
  stakingAddress: {type: String, index: true, lowercase: true}, //
  stakeNftAddress: {type: String, lowercase: true},
  tokenId: {type: String, index: true}, //
  amount: Number  
});

// stakeditemSchema.index({ stakingAddress: 1, owner: 1, amount: 1 });

const StakedItem = mongoose.model('stakeditems', stakeditemSchema);

module.exports = StakedItem;
