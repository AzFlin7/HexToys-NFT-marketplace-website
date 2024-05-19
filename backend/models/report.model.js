const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  id: {type: String, index: true},//
  timestamp: {type: Number, index: true},
  itemCollection: {type: String, index: true, lowercase: true},
  from: {type: String, index: true, lowercase: true},  //
  description: String,
  isResolved: {type: Boolean, default: false}
});

const Report = mongoose.model('reports', reportSchema);
module.exports = Report;
