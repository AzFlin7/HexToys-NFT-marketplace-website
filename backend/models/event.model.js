const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number, index: true},
  txhash: String,
  itemCollection: {type: String, lowercase: true},
  tokenId: String,
  name: {type: String, index: true},
  from: {type: String, index: true, lowercase: true},
  to: {type: String, index: true, lowercase: true},
  tokenAdr: {type: String, lowercase: true},
  price: Number,
  amount: Number
});

eventSchema.index({ tokenId: 1, itemCollection: 1, name: 1});
eventSchema.index({ itemCollection: 1, name: 1});

const Event = mongoose.model('events', eventSchema);
module.exports = Event;
