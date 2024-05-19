const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number, index: true},
  from: {type: String, lowercase: true},  
  to: {type: String, index: true, lowercase: true},  
});

followSchema.index({ from: 1 , to: 1});
const Follow = mongoose.model('follows', followSchema);
module.exports = Follow;
