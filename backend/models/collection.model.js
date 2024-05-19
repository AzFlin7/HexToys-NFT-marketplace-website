const mongoose = require('mongoose');

const itemCollectionSchema = new mongoose.Schema({
  timestamp: { type: Number, index: true },
  startBlock: { type: Number },
  address: { type: String, lowercase: true, index: true }, 
  ownerAddress: { type: String, lowercase: true, index: true },
  type:  { type: String},
  uri: String,
  name: { type: String },

  description: String,
  category: String,
  image: String,
  lowLogo: String, //item 100 X 100 image
  mediumLogo: String, //item 250 X 250 image
  highLogo: String, //item 500 X 500 image
  coverImg: String,
  coverUrl: String,

  isPublic: { type: Boolean, default: false },
  isImported: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: false },
  whitelist: [{ type: String, lowercase: true }],

  royalties: [{ address: { type: String, lowercase: true }, percentage: Number}],

  visibility: { type: Boolean, default: true },
  reviewStatus: { type: Number, default: 0 }, // 0: default, 1: Under Review, 2: Approved, 3: Subscribed (4: Expired)

  // Social links
  website: String,
  telegram: String,
  discord: String,
  twitter: String, 
  facebook: String,
  instagram: String,

  syncTimestamp: { type: Number, index: true },
  tradingVolume: { type: Number, index: true },
  tradingCount: Number,
  totalItemCount: Number,
  totalOwners: Number,
  coinPrice: Number,

  traitsTypes: { type : Array , "default" : [] },

  isFeatured: { type: Boolean, default: false, index: true },
  bgUrl: String,
  logoUrl: String,
  logoType: String,//image or video

  isETH: { type: Boolean, default: true, index: true },
});

itemCollectionSchema.index({ name: 'text', address: 'text' });

itemCollectionSchema.index({ isSynced: 1, visibility: 1, ownerAddress: 1, isImported: 1});

const ItemCollection = mongoose.model('item_collections', itemCollectionSchema);

module.exports = ItemCollection;
