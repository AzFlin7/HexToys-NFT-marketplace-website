const mongoose = require('mongoose');

const mysteryboxSchema = new mongoose.Schema({
  address: {type: String, lowercase: true, index: true},
  timestamp: {type: Number, index: true},
  name: {type: String},
  uri: String,
  description: String,
  image: String,
  tokenAddress: {type: String, lowercase: true}, //ERC20 token address
  price: Number, 
  owner: {type: String, lowercase: true, index: true}, //address of the owner
  cardAmount: {type: Number, index: true}, // card amount
  status: {type: Boolean, default: true},  
  visible: {type: Boolean, default: true}
});

mysteryboxSchema.index({ status: 1, visible: 1});
mysteryboxSchema.index({ status: 1, visible: 1, owner: 1});
mysteryboxSchema.index({ name: 'text', address: 'text' });

const MysteryBox = mongoose.model('mysteryboxes', mysteryboxSchema);

module.exports = MysteryBox;
