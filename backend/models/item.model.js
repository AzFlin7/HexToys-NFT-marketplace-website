const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: { type: String, index: true },
  timestamp: { type: Number },
  blockNumber: { type: Number, index: true },
  itemCollection: { type: String, lowercase: true },
  tokenId: String,
  type: { type: String, index: true }, // item type multi/single
  uri: String, // item metadata information  

  name: { type: String, required: true, index: true },
  description: String, //item description
  image: String, //item image
  lowLogo: String, //item 100 X 100 image
  mediumLogo: String, //item 250 X 250 image
  highLogo: String, //item 500 X 500 image
  animation_url: String, //item animation file
  animUrl: String,
  asset_type: String, //item main file type
  attributes: [{ trait_type: String, value: String }], //item properties

  holders: [{ address: { type: String, lowercase: true }, balance: { type: Number } }],
  likeCount: { type: Number, default: 0, index: true },
  likes: [{ type: String, lowercase: true}], //addresses
  marketList: [{ type: String }], // pair/auction

  isSynced: { type: Boolean, default: true },
  isThumbSynced: { type: Boolean, default: false },
  isAnimSynced: { type: Boolean, default: false },
  visibility: { type: Boolean, default: true }, //sync with collection changing
  isETH: { type: Boolean, default: true },
  // price information
  usdPrice: { type: Number, default: 0, index: true },
});

itemSchema.index({ name: 'text' });

itemSchema.index({ attributes: 1});
itemSchema.index({ usdPrice: -1});
itemSchema.index({ likeCount: -1});
itemSchema.index({ blockNumber: -1});
itemSchema.index({ tokenId: 1, itemCollection: 1});

itemSchema.index({ isSynced: 1, visibility: 1, likes: 1, type: 1});
itemSchema.index({ isSynced: 1, visibility: 1, holders: 1, type: 1});
itemSchema.index({ isSynced: 1, visibility: 1, holders: 1, isETH: 1});

itemSchema.index({ isSynced: 1, visibility: 1, itemCollection: 1, marketList: 1});
itemSchema.index({ isSynced: 1, visibility: 1, type: 1, marketList: 1});

itemSchema.index({ isAnimSynced: 1, image: 1});
itemSchema.index({ isThumbSynced: 1, image: 1});
itemSchema.index({ uri: 1, itemCollection: 1, holders: 1});
itemSchema.index({ image: 1, itemCollection: 1});
itemSchema.index({ uri: 1, blockNumber: 1});
itemSchema.index({ uri: 1, itemCollection: 1, blockNumber: 1});

itemSchema.index({ isAnimSynced: 1, isThumbSynced: 1});
itemSchema.index({ itemCollection: 1, isSynced: 1, visibility: 1, usdPrice: 1, marketList: 1});
itemSchema.index({ itemCollection: 1, isSynced: 1, visibility: 1, usdPrice: -1, marketList: 1});
itemSchema.index({ itemCollection: 1, isSynced: 1, visibility: 1, likeCount: -1, marketList: 1});
itemSchema.index({ itemCollection: 1, usdPrice: 1});
itemSchema.index({ itemCollection: 1, isAnimSynced: 1, image: 1});
itemSchema.index({ itemCollection: 1, isThumbSynced: 1, image: 1});
itemSchema.index({ itemCollection: 1, usdPrice: -1});
itemSchema.index({ itemCollection: 1, isSynced: 1, visibility: 1, name: 1, marketList: 1});


const Item = mongoose.model('items', itemSchema);

module.exports = Item;

 