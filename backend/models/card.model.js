const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: {type: String, index: true},
  timestamp: {type: Number, index: true},

  mysteryboxAddress: {type: String, lowercase: true},
  cardType: {type: Number}, // card type 0:ERC721, 1:ERC1155  
  key: String, 
  collectionId: {type: String, lowercase: true}, //nft collection address
  tokenId: String, //  nft tokenId
  amount: {type: Number, index: true},
});


cardSchema.index({ mysteryboxAddress: 1, amount: 1 });
const Card = mongoose.model('cards', cardSchema);

module.exports = Card;
