const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: {type: String, lowercase: true}, //user address
  ensName: String,
  nonce: { type: Number, defuault: Math.floor(Math.random() * 1000000) },
  name: String,
  bio: String,
  email: String,
  twitter: String,
  instagram: String,
  originalLogo: String, //Original Logo
  lowLogo: String, //100 X 100 image
  mediumLogo: String, //250 X 250 image
  highLogo: String, //500 X 500 image
  bannerUrl: String,
});
userSchema.index({ name: 'text', address: 'text' });
userSchema.index({ address: 1 }, { unique: true });
const User = mongoose.model('users', userSchema);

module.exports = User;
