const mongoose = require('mongoose');

const subscribeSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number},
  txhash: String,
  itemCollection: {type: String, index: true, lowercase: true}, 
  subscriber: {type: String, lowercase: true},
  amount: Number,
  lastDate: Number,
  expireDate: Number,
});

const Subscribe = mongoose.model('subscribes', subscribeSchema);
module.exports = Subscribe;
