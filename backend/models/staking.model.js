const mongoose = require('mongoose');

const stakingSchema = new mongoose.Schema({
  timestamp: {type: Number, index: true}, //
  address: {type: String, index: true, lowercase: true},
  type: String, // single, multi
  stakeNftAddress: {type: String, index: true, lowercase: true}, //
  rewardTokenAddress: {type: String, lowercase: true},
  stakeNftPrice: Number,
  apr: {type: Number, index: true}, //
  creatorAddress: {type: String, index: true, lowercase: true}, //
  maxStakedNfts: Number,
  maxNftsPerUser: Number,
  depositFeePerNft: Number,
  withdrawFeePerNft: Number,
  startTime: {type: Number, index: true}, //
  endTime: {type: Number, index: true}, //
  totalStakedNfts: {type: Number, index: true} //
});

const Staking = mongoose.model('stakings', stakingSchema);
module.exports = Staking;
