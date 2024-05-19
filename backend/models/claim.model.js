const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  id: Number,
  timestamp: {type: Number, index: true},
  itemCollection: {type: String, index: true, lowercase: true},//
  tokenId: String,
  type: { type: String }, // item type multi/single
  from: {type: String, index: true, lowercase: true},  //
  amount: Number,
  delivery: String,
  status: Number, // requested: 0, approved: 1
  signature: String,
});

claimSchema.index({ id: 1});
claimSchema.index({ name: 'text', address: 'text' });
const Claim = mongoose.model('claims', claimSchema);
module.exports = Claim;
