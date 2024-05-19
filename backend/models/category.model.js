const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: {type: String, unique: true, index: true},
  name: String,
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
