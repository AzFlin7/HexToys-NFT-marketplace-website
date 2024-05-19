const mongoose = require("mongoose");
const BaseController = require("./BaseController");
const User = require("../models/user.model");
const ItemCollection = require("../models/collection.model");
const Item = require("../models/item.model");
const Pair = require("../models/pair.model");
const Sold = require("../models/sold.model");
const Auction = require("../models/auction.model");
const Event = require("../models/event.model");
const Bid = require("../models/bid.model");
const Category = require("../models/category.model");
const MysteryBox = require('../models/mysterybox.model');
const Card = require('../models/card.model');
const StakedItem = require('../models/stakeditem.model');
const Staking = require('../models/staking.model');
const Token = require('../models/token.model');
const Gas = require('../models/gas.model');

const Hourstat = require('../models/hourstat.model');
const Daystat = require('../models/daystat.model');
const Weekstat = require('../models/weekstat.model');
const Monthstat = require('../models/monthstat.model');

const axios = require('axios');
const FastXmlParser = require('fast-xml-parser');

module.exports = BaseController.extend({
  name: "ApiController",

  // get nfts
  getItems: async function (req, res, next) {
    const that = this;
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 12;
    let data = this.handleItemGetRequest(req, limitNum);

    Item.find(data.query, { __v: 0, _id: 0 })
      .sort(data.sort)
      .limit(limitNum)
      .skip(data.skip)
      .lean()
      .exec(async function (err, items) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!items) return res.status(200).send({ status: false, message: "No Items found" });

        let collectionAddrs = [];
        for (let index = 0; index < items.length; index++) {
          let item = items[index];
          collectionAddrs.push(item.itemCollection);
        }
        let collections = await ItemCollection.find({ address: { $in: collectionAddrs } }).lean();

        for (let index = 0; index < items.length; index++) {
          let item = items[index];
          // setup collection info
          item.collectionInfo = collections.filter(collection => collection.address === item.itemCollection)[0];

          // setup supply
          var supply = 0;
          for (let index = 0; index < item.holders.length; index++) {
            const holdElement = item.holders[index];
            supply = supply + holdElement.balance;
          }
          item.supply = supply;

          //set up pair information    

          const firstPairs = await Pair.find({ tokenId: item.tokenId, itemCollection: item.itemCollection }, { _id: 0, __v: 0 }).sort({ usdPrice: 1 }).limit(1).lean();
          if (firstPairs && firstPairs?.length > 0) {
            item.pairInfo = firstPairs[0];
          }

          //set up auction information
          var auction = await Auction.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection }, { _id: 0, __v: 0 }).lean();
          if (auction) {
            auction.price = auction.startPrice;
            item.auctionInfo = auction;
          }
        }

        Item.countDocuments(data.query, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, items: items, count: count });
        });
      });
  },

  // home page
  getFeaturedCollections: async function (req, res, next) {
    // const address_list = [
    //   '0xa35a6162eaecddcf571aeaa8edca8d67d815cee4',
    //   '0x7896814143a2e8b86d58e702a072a3e2c8937d75',
    //   '0x7593b3521bf263817d8447480960aac73d854a7d',
    //   '0xf886f928e317cfd4085137a7a755c23d87f81908',
    // ];
    // let ret = [];
    // for (let index = 0; index < address_list.length; index++) {
    //   const address = address_list[index];
    //   var collection = await ItemCollection.find({ address: address, isFeatured: true }, { _id: 0, __v: 0 }).lean();
    //   if (collection) {
    //     ret.push(collection);
    //   }
    // }
    // res.status(200).send({ status: true, collections: ret, count: address_list.length });
    const collections = await ItemCollection.find({ isFeatured: true }, { _id: 0, __v: 0 }).lean();
    const hexToysCol = collections.find(_collection => _collection.address.toLowerCase() === "0xa35a6162eaecddcf571aeaa8edca8d67d815cee4")
    const dexToysCol = collections.find(_collection => _collection.address.toLowerCase() === "0xf886f928e317cfd4085137a7a755c23d87f81908")
    let ret = [];
    if (hexToysCol) ret.push(hexToysCol)
    for (const collection of collections) {
      if (!["0xa35a6162eaecddcf571aeaa8edca8d67d815cee4", "0xf886f928e317cfd4085137a7a755c23d87f81908"].includes(collection.address.toLowerCase())) {
        ret.push(collection)
      }
    }
    if (dexToysCol) ret.push(dexToysCol)
    res.status(200).send({ status: true, collections: ret, count: collections.length });

  },

  getTopNFTs: async function (req, res, next) {
    const that = this;
    let ret = [];

    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 10;

    const soldQuery = [
      {
        $group: {
          _id: {
            'itemCollection': '$itemCollection',
            'tokenId': '$tokenId'
          },
          tradingVolume: {
            $sum: '$usdVolume'
          },
          tradingCount: {
            $sum: '$amount'
          }
        }
      },
      {
        $sort: {
          tradingVolume: -1
        }
      },
      {
        $limit: limitNum
      }
    ];

    const idList = await Sold.aggregate(soldQuery);
    if (idList && idList?.length > 0) {
      let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });

      for (let index = 0; index < idList.length; index++) {
        var ItemId = idList[index];
        var itemCollection = ItemId._id.itemCollection;
        var tokenId = ItemId._id.tokenId;
        const item = await Item.findOne({ tokenId: tokenId, itemCollection: itemCollection }, { __v: 0, _id: 0 }).lean();

        item.coinPrice = token.rate;
        item.tradingVolume = ItemId.tradingVolume;
        item.tradingCount = ItemId.tradingCount;
        ret.push(item)
      }
    }

    if (ret && ret?.length > 0) {
      res.status(200).send({ status: true, items: ret, count: ret?.length });
    } else {
      return res.status(200).send({ status: false, message: "No Items found" });
    }
  },

  // home page
  getTop3Collections: async function (req, res, next) {
    Monthstat.find({
      tradingVolume: { $gt: 0 }
    }, { __v: 0, _id: 0 })
      .sort({ tradingVolume: -1 })
      .limit(3)
      .lean()
      .exec(async function (err, collections) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        res.status(200).send({ status: true, collections: collections });
      });
  },

  // home page
  getTopCollections: async function (req, res, next) {

    let duration = req.query.duration ? req.query.duration : 'Day'; // Hour, Day, Week, Month

    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 10;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limitNum;

    let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });
    // floor filter
    let floorMin = req.query.floorMin ? Number(req.query.floorMin) * token.rate : 0;
    let floorMax = req.query.floorMax ? Number(req.query.floorMax) * token.rate : 0;
    let floorQuery = {
      tradingVolume: { $gt: 0 }
    }
    if (floorMin > 0) {
      if (floorMax > 0) {
        if (floorMax > floorMin) {
          floorQuery["floorPrice"] = { $gt: floorMin, $lt: floorMax }
        }
      } else {
        floorQuery["floorPrice"] = { $gt: floorMin }
      }
    } else {
      if (floorMax > 0) {
        floorQuery["floorPrice"] = { $lt: floorMax }
      } else {

      }
    }

    switch (duration) {
      case 'Hour':
        Hourstat.find(floorQuery, { __v: 0, _id: 0 })
          .sort({ tradingVolume: -1 })
          .limit(limitNum)
          .skip(skip)
          .lean()
          .exec(async function (err, collections) {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collections) return res.status(200).send({ status: false, message: "No Collections found" });

            Hourstat.countDocuments(floorQuery, function (err2, count) {
              if (err2) return res.status(200).send({ status: false, message: err2.message });
              res.status(200).send({ status: true, collections: collections, count: count });
            });
          });
        break;

      case 'Day':
        Daystat.find(floorQuery, { __v: 0, _id: 0 })
          .sort({ tradingVolume: -1 })
          .limit(limitNum)
          .skip(skip)
          .lean()
          .exec(async function (err, collections) {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collections) return res.status(200).send({ status: false, message: "No Collections found" });

            Daystat.countDocuments(floorQuery, function (err2, count) {
              if (err2) return res.status(200).send({ status: false, message: err2.message });
              res.status(200).send({ status: true, collections: collections, count: count });
            });
          });
        break;

      case 'Week':
        Weekstat.find(floorQuery, { __v: 0, _id: 0 })
          .sort({ tradingVolume: -1 })
          .limit(limitNum)
          .skip(skip)
          .lean()
          .exec(async function (err, collections) {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collections) return res.status(200).send({ status: false, message: "No Collections found" });

            Weekstat.countDocuments(floorQuery, function (err2, count) {
              if (err2) return res.status(200).send({ status: false, message: err2.message });
              res.status(200).send({ status: true, collections: collections, count: count });
            });
          });
        break;

      case 'Month':
        Monthstat.find(floorQuery, { __v: 0, _id: 0 })
          .sort({ tradingVolume: -1 })
          .limit(limitNum)
          .skip(skip)
          .lean()
          .exec(async function (err, collections) {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collections) return res.status(200).send({ status: false, message: "No Collections found" });

            Monthstat.countDocuments(floorQuery, function (err2, count) {
              if (err2) return res.status(200).send({ status: false, message: err2.message });
              res.status(200).send({ status: true, collections: collections, count: count });
            });
          });
        break;

      default:
        Daystat.find(floorQuery, { __v: 0, _id: 0 })
          .sort({ tradingVolume: -1 })
          .limit(limitNum)
          .skip(skip)
          .lean()
          .exec(async function (err, collections) {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collections) return res.status(200).send({ status: false, message: "No Collections found" });

            Daystat.countDocuments(floorQuery, function (err2, count) {
              if (err2) return res.status(200).send({ status: false, message: err2.message });
              res.status(200).send({ status: true, collections: collections, count: count });
            });
          });
        break;
    }
  },

  // home page
  getRecentlySold: async function (req, res, next) {
    const that = this;
    let ret = [];

    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 10;

    let match = {}
    if (req.query.collection) {
      match = {
        itemCollection: req.query.collection.toLowerCase()
      }
    }

    const soldQuery = [
      {
        $match: match
      },
      {
        $group: {
          _id: {
            'itemCollection': '$itemCollection',
            'tokenId': '$tokenId'
          },
          lastSold: {
            $max: '$timestamp'
          },
        }
      },
      {
        $sort: {
          lastSold: -1
        }
      },
      {
        $limit: limitNum
      }
    ];

    const idList = await Sold.aggregate(soldQuery);
    if (idList && idList?.length > 0) {
      let collectionAddrs = [];
      let soldIds = [];
      let itemIds = [];
      for (let index = 0; index < idList.length; index++) {
        var ItemId = idList[index];
        var itemCollection = ItemId._id.itemCollection;
        var tokenId = ItemId._id.tokenId;
        var lastSold = ItemId.lastSold;

        collectionAddrs.push(ItemId._id.itemCollection);
        soldIds.push(`${itemCollection}-${tokenId}-${lastSold}`);
        itemIds.push(`${itemCollection}-${tokenId}`);
      }

      let collections = await ItemCollection.find({ address: { $in: collectionAddrs } }).lean();
      let tokens = await Token.find({}).lean();
      let items = await Item.find({ id: { $in: itemIds } }).lean();
      let solds = await Sold.find({ id: { $in: soldIds } }).lean();

      for (let index = 0; index < idList.length; index++) {
        var ItemId = idList[index];
        var itemCollection = ItemId._id.itemCollection;
        var tokenId = ItemId._id.tokenId;
        var lastSold = ItemId.lastSold;

        let itemEntity = items.filter(item => item.id === `${itemCollection}-${tokenId}`)[0];
        let soldInfo = solds.filter(sold => sold.id === `${itemCollection}-${tokenId}-${lastSold}`)[0];

        soldInfo.tokenInfo = tokens.filter(token => token.address === soldInfo.tokenAdr)[0];
        itemEntity.soldInfo = soldInfo;
        itemEntity.collectionInfo = collections.filter(collection => collection.address === itemCollection)[0];
        ret.push(itemEntity)
      }
    }

    if (ret && ret?.length > 0) {
      res.status(200).send({ status: true, items: ret, count: ret?.length });
    } else {
      return res.status(200).send({ status: false, message: "No Items found" });
    }
  },

  // home page
  getArticles: async function (req, res, next) {
    try {
      var axiosConfig = {
        method: 'get',
        url: 'https://blog.hex.toys/feed',
        headers: {
          'Content-Type': 'text/xml'
        },
        data: '{}'
      };
      const result = await axios(axiosConfig);
      const parser = new FastXmlParser.XMLParser();
      const json = parser.parse(result.data);
      const items = json?.rss?.channel?.item;

      if (items && items.length > 0) {
        res.status(200).send({ status: true, items: items });
      } else {
        return res.status(200).send({ status: false, message: "Can not get blog data" });
      }
    } catch (error) {
      return res.status(200).send({ status: false, message: "Can not get blog data" });
    }
  },

  // leader board
  getLeaderboard: async function (req, res, next) {
    const that = this;
    let ret = [];

    const soldQuery = [
      {
        $group: {
          _id: '$seller',
          tradingVolume: {
            $sum: '$usdVolume'
          },
          tradingCount: {
            $sum: '$amount'
          },
          highPrice: {
            $max: '$usdPrice'
          },
          lowPrice: {
            $min: '$usdPrice'
          },
        }
      },
      {
        $sort: {
          tradingVolume: -1
        }
      },
      {
        $limit: 100
      }
    ];

    const tradingInfos = await Sold.aggregate(soldQuery);
    if (tradingInfos && tradingInfos?.length > 0) {
      let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });

      let addresses = [];
      for (let index = 0; index < tradingInfos.length; index++) {
        var tradingInfo = tradingInfos[index];
        addresses.push(tradingInfo._id);

      }
      let users = await User.find({ address: { $in: addresses } }).lean();

      for (let index = 0; index < tradingInfos.length; index++) {
        var tradingInfo = tradingInfos[index];

        let userInfo = users.filter(user => user.address === tradingInfo._id)[0];
        userInfo.tradingInfo = tradingInfo;
        userInfo.coinPrice = token.rate;
        ret.push(userInfo)
      }
    }

    if (ret && ret?.length > 0) {
      res.status(200).send({ status: true, users: ret, count: ret?.length });
    } else {
      return res.status(200).send({ status: false, message: "No Users found" });
    }
  },

  // for hex toys collection
  getExclusiveItems: async function (req, res, next) {
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 36;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limitNum;

    if (!req.query.collection) {
      return res.status(200).send({ status: false, message: 'missing collection address' });
    }
    const collectionAddr = req.query.collection.toLowerCase();

    Item.find({
      itemCollection: collectionAddr
    }, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .exec(async function (err, items) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!items) return res.status(200).send({ status: false, message: "No Items found" });

        let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });


        let tokenIds = [];
        for (let index = 0; index < items.length; index++) {
          tokenIds.push(items[index].tokenId);
        }

        const soldQuery = [
          {
            $match: {
              itemCollection: collectionAddr,
              tokenId: { $in: tokenIds }
            }
          },
          {
            $group: {
              _id: {
                'itemCollection': '$itemCollection',
                'tokenId': '$tokenId'
              },
              tradingVolume: {
                $sum: '$usdVolume'
              },
              tradingCount: {
                $sum: '$amount'
              },
            }
          }
        ];
        const idList = await Sold.aggregate(soldQuery);

        for (let index = 0; index < items.length; index++) {
          let item = items[index];
          item.coinPrice = token.rate;

          const soldinfos = idList.filter(idInfo => ((idInfo._id.itemCollection === item.itemCollection) && (idInfo._id.tokenId === item.tokenId)))
          if (soldinfos && soldinfos.length > 0) {
            item.tradingVolume = soldinfos[0].tradingVolume;
            item.tradingCount = soldinfos[0].tradingCount;
          } else {
            item.tradingVolume = 0;
            item.tradingCount = 0;
          }

          // setup supply
          var supply = 0;
          for (let index = 0; index < item.holders.length; index++) {
            const holdElement = item.holders[index];
            supply = supply + holdElement.balance;
          }
          item.supply = supply;
        }

        Item.countDocuments({
          itemCollection: collectionAddr
        }, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, items: items, count: count });
        });
      });
  },

  // nft detail
  detail: async function (req, res) {
    if (!req.params.tokenId || !req.params.collection)
      return res.status(200).send({ status: false, message: "missing params" });
    let tokenId = req.params.tokenId;
    let itemCollection = req.params.collection.toLowerCase();
    const that = this;
    Item.findOne(
      { tokenId: tokenId, itemCollection: itemCollection },
      { __v: 0, _id: 0 }
    )
      .lean()
      .exec(async function (err, item) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!item) return res.status(200).send({ status: false, message: "No item found" });

        // set supply
        var supply = 0;
        for (let index = 0; index < item.holders.length; index++) {
          const holdElement = item.holders[index];
          supply = supply + holdElement.balance;
        }
        item.supply = supply;

        //set up collection
        var collection = await ItemCollection.findOne({ address: itemCollection }, { _id: 0, __v: 0 }).lean();
        item.collectionInfo = collection;

        //set up auction information
        var auction = await Auction.findOne({ tokenId: tokenId, itemCollection: itemCollection }, { _id: 0, __v: 0 }).lean();
        if (auction) {
          auction.price = auction.startPrice;
          let bids = await Bid.find({ auctionId: auction.auctionId }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).limit(1000).lean();

          if (bids.length > 0) {
            let addresses = [];
            for (let index = 0; index < bids.length; index++) {
              const bid = bids[index];
              addresses.push(bid.from);
            }
            let users = await User.find({ address: { $in: addresses } });

            for (let index = 0; index < bids.length; index++) {
              const bid = bids[index];

              let fromUsers = users.filter(user => user.address === bid.from);
              if (fromUsers && fromUsers.length > 0) {
                bid.fromUser = fromUsers[0];
              } else {
                bid.fromUser = {
                  address: bid.from,
                  name: "NoName",
                  originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
                };
              }
            }
            auction.price = bids[0].bidPrice
            auction.bids = bids
          }

          let user = await User.findOne({ address: auction.owner }, { _id: 0, __v: 0 }).lean();
          if (!user) {
            auction.ownerUser = {
              address: auction.owner.toLowerCase(),
              name: "NoName",
              originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
            };
          } else {
            auction.ownerUser = user;
          }
          item.auctionInfo = auction
        }

        let pairs = await Pair.find({ tokenId: tokenId, itemCollection: itemCollection }, { _id: 0, __v: 0 }).sort({ usdPrice: 1 }).limit(1000).lean();
        if (pairs && pairs.length > 0) {
          let addresses = [];
          for (let index = 0; index < pairs.length; index++) {
            const pair = pairs[index];
            addresses.push(pair.owner);
          }
          let users = await User.find({ address: { $in: addresses } });
          for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];

            let ownerUsers = users.filter(user => user.address === pair.owner);
            if (ownerUsers && ownerUsers.length > 0) {
              pair.ownerUser = ownerUsers[0];
            } else {
              pair.ownerUser = {
                address: pair.owner,
                name: "NoName",
                originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
              };
            }
          }
          item.pairs = pairs;
        }

        // setup holders
        let addresses = [];
        for (let i = 0; i < Math.min(item.holders.length, 1000); i++) {
          addresses.push(item.holders[i].address);
        }
        let users = await User.find({ address: { $in: addresses } });
        for (let i = 0; i < item.holders.length; i++) {
          let holders = users.filter(user => user.address === item.holders[i].address);
          if (holders && holders.length > 0) {
            item.holders[i].user = holders[0];
          } else {
            item.holders[i].user = {
              address: item.holders[i].address,
              name: "NoName",
              originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
            };
          }
        }

        // setup owner
        if (item.type == "single") {
          // set up owner address.
          var ownerAddress = ''
          if (auction) {
            ownerAddress = auction.owner
          } else if (pairs && pairs?.length > 0) {
            ownerAddress = item.pairs[0].owner;
          } else {
            ownerAddress = item.holders[0].address
          }


          // setup owner user
          var owner = await User.findOne({ address: ownerAddress }, { _id: 0, __v: 0 }).lean();
          if (!owner) {
            item.ownerUser = {
              address: ownerAddress,
              name: "NoName",
              originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
            };
          } else {
            item.ownerUser = owner;
          }
        }

        // get more items
        let ret_more = [];

        let moreItems = await Item.find({ itemCollection: itemCollection }, { __v: 0, _id: 0 }).sort({ timestamp: -1 }).limit(5).lean();
        for (let i = 0; i < moreItems.length; i++) {
          let moreItem = moreItems[i];
          if ((moreItem.tokenId != tokenId) && ret_more.length < 4) {
            const itemEntity = await that.getItemDetail(moreItem.tokenId, moreItem.itemCollection);
            ret_more.push(itemEntity);
          }
        }
        item.more = ret_more;
        res.status(200).send({ status: true, item: item });
      });
  },

  // nft detail
  getBids: async function (req, res, next) {
    if (!req.query.auctionId)
      return res.status(200).send({ status: false, message: "missing auction id" });
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 20) : 10;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;

    Bid.find({ auctionId: Number(req.query.auctionId) }, { __v: 0, _id: 0 })
      .sort({ bidPrice: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .exec(async function (err, bids) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!bids) return res.status(200).send({ status: false, message: "No bids found" });
        if (bids.length > 0) {
          let addresses = [];
          for (let index = 0; index < bids.length; index++) {
            const bid = bids[index];
            addresses.push(bid.fromUser);
          }
          const users = await User.find({ address: { $in: addresses } });
          for (let index = 0; index < bids.length; index++) {
            const bid = bids[index];
            let fromUsers = users.filter(user => user.address === bid.from);
            if (fromUsers && fromUsers.length > 0) {
              bid.fromUser = fromUsers[0];
            } else {
              bid.fromUser = {
                address: bid.from,
                name: "NoName",
                originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
              };
            }
          }
        }

        Bid.countDocuments({ auctionId: Number(req.query.auctionId) }, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, bids: bids, count: count });
        });
      });
  },

  // nft detail
  getPairs: async function (req, res, next) {
    if (req.query.itemCollection) {
      req.query.itemCollection = req.query.itemCollection.toLowerCase();
    }
    if (req.query.owner) {
      req.query.owner = req.query.owner.toLowerCase();
    }

    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 20) : 10;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;

    delete req.query.limit;
    delete req.query.page;

    Pair.find(req.query, { __v: 0, _id: 0 })
      .sort({ usdPrice: 1 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .exec(async function (err, pairs) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!pairs) return res.status(200).send({ status: false, message: "No pairs found" });
        if (pairs.length > 0) {
          let addresses = [];
          for (let index = 0; index < pairs.length; index++) {
            const pair = pairs[index];
            addresses.push(pair.owner);
          }
          let users = await User.find({ address: { $in: addresses } });

          for (let index = 0; index < pairs.length; index++) {
            const pair = pairs[index];
            let ownerUsers = users.filter(user => user.address === pair.owner);
            if (ownerUsers && ownerUsers.length > 0) {
              pair.ownerUser = ownerUsers[0];
            } else {
              pair.ownerUser = {
                address: pair.owner,
                name: "NoName",
                originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
              };
            }
          }
        }

        Pair.countDocuments(req.query, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, pairs: pairs, count: count });
        });
      });
  },

  // get activities
  getActivities: async function (req, res, next) {
    const that = this;
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 10;
    let data = this.handleEventGetRequest(req, limitNum);
    Event.find(data.query, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(data.skip)
      .lean()
      .exec(async function (err, events) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!events) return res.status(200).send({ status: false, message: "No events found" });
        let from_addresses = [];
        let to_addresses = [];
        let itemIds = [];
        for (let index = 0; index < events.length; index++) {
          const event = events[index];
          from_addresses.push(event.from);
          to_addresses.push(event.to);
          itemIds.push(`${event.itemCollection}-${event.tokenId}`);
        }

        const from_users = await User.find({ address: { $in: from_addresses } });
        const to_users = await User.find({ address: { $in: to_addresses } });
        const items = await Item.find({ id: { $in: itemIds } });

        for (let i = 0; i < events.length; i++) {
          let event = events[i];
          if (event.from) {
            let fromUsers = from_users.filter(user => user.address === event.from);
            if (fromUsers && fromUsers.length > 0) {
              event.fromUser = fromUsers[0];
            } else {
              event.fromUser = {
                address: event.from,
                name: "NoName",
                originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
              };
            }
          }
          if (event.to) {
            let toUsers = to_users.filter(user => user.address === event.to);
            if (toUsers && toUsers.length > 0) {
              event.toUsers = toUsers[0];
            } else {
              event.toUsers = {
                address: event.to,
                name: "NoName",
                originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
              };
            }
          }
          event.itemInfo = items.filter(item => item.id === `${event.itemCollection}-${event.tokenId}`)[0];
        }

        Event.countDocuments(data.query, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, events: events, count: count });
        });
      });
  },

  // item detail to show price chart
  getTradingHistory: async function (req, res, next) {
    const that = this;

    if (req.query.itemCollection) {
      req.query.itemCollection = req.query.itemCollection.toLowerCase();
    }

    if (req.query.seller) {
      req.query.seller = req.query.seller.toLowerCase();
    }

    const soldQuery = [
      {
        $match: req.query
      },
      {
        $group: {
          _id: {
            'year': '$year',
            'month': '$month',
            'day': '$day'
          },
          tradingVolume: {
            $sum: '$usdVolume'
          },
          tradingCount: {
            $sum: '$amount'
          },
          firstTimestamp: {
            $first: '$timestamp'
          },
        }
      },
      {
        $sort: {
          firstTimestamp: 1
        }
      }
    ];

    let ret = [];
    const tradingList = await Sold.aggregate(soldQuery);
    let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });

    if (tradingList && tradingList?.length > 0) {
      for (let index = 0; index < tradingList.length; index++) {
        let tradingItem = tradingList[index];
        tradingItem.time = `${tradingItem._id.year}-${(tradingItem._id.month < 10 ? '0' : '') + tradingItem._id.month}-${(tradingItem._id.day < 10 ? '0' : '') + tradingItem._id.day}`
        ret.push(tradingItem)
      }
      res.status(200).send({
        status: true,
        tradings: ret,
        coinPrice: token.rate
      });
    } else {
      return res.status(200).send({ status: false, message: "No trading found" });
    }
  },

  // like nft
  like: async function (req, res, next) {
    if (!req.body.address || !req.body.tokenId || !req.body.itemCollection)
      return res.status(200).send({ status: false, message: "missing params" });

    Item.findOne(
      { tokenId: req.body.tokenId, itemCollection: req.body.itemCollection.toLowerCase() },
      async (err, item) => {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!item) return res.status(200).send({ status: false, message: "No item found" });

        if (item.likes.includes(req.body.address.toLowerCase())) {
          item.likes.splice(
            item.likes.indexOf(req.body.address.toLowerCase()),
            1
          );
          item.likeCount = item.likeCount - 1;
        } else {
          item.likes.push(req.body.address.toLowerCase());
          item.likeCount = item.likeCount + 1;
        }

        await item.save();

        res.status(200).send({ status: true, item: item });
      }
    );
  },

  // get category
  categories: async function (req, res, next) {
    Category.find({}, { _id: 0, __v: 0 }, async (err, items) => {
      if (err) return res.status(200).send({ status: false, message: err.message });
      if (!items) return res.status(200).send({ status: false, message: "No item found" })

      res.status(200).send({ status: true, categories: items })
    })
  },

  // mysterybox
  getMysteryBoxes: async function (req, res, next) {
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 6;
    let data = this.handleMysteryBoxGetRequest(req, limitNum);
    MysteryBox.find(data.query, { __v: 0, _id: 0 })
      .sort(data.sort)
      .limit(limitNum)
      .skip(data.skip)
      .lean()
      .exec(async function (err, mysteryboxes) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!mysteryboxes) return res.status(200).send({ status: false, message: "No MysteryBoxes found" });

        MysteryBox.countDocuments(data.query, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, mysteryboxes: mysteryboxes, count: count });
        });
      });
  },

  getMysteryBoxDetail: async function (req, res, next) {

    MysteryBox.findOne(req.query, async (err, mysterybox) => {
      if (err) return res.status(200).send({ status: false, message: err.message });
      if (!mysterybox) return res.status(200).send({ status: false, message: "No MysteryBox found" })

      mysterybox.visible ?
        res.status(200).send({ status: true, mysterybox: mysterybox }) :
        res.status(200).send({ status: false, message: "You can not see the mysterybox" })
    })
  },

  getCards: async function (req, res, next) {
    const that = this;
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 12;
    let data = this.handleCardGetRequest(req, limitNum);
    Card.find(data.query, { __v: 0, _id: 0 })
      .sort(data.sort)
      .limit(limitNum)
      .skip(data.skip)
      .lean()
      .exec(async function (err, cards) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!cards) return res.status(200).send({ status: false, message: "No cards found" });

        for (let i = 0; i < cards.length; i++) {
          let card = cards[i];
          const itemEntity = await that.getItemDetail(card.tokenId, card.collectionId);
          card.itemInfo = itemEntity;
        }

        Card.countDocuments(data.query, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, cards: cards, count: count });
        });
      });
  },
  getCardDetail: async function (req, res, next) {
    const that = this;

    Card.findOne(req.query)
      .lean()
      .exec(async function (err, card) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!card) return res.status(200).send({ status: false, message: "No Card found" })
        const itemEntity = await that.getItemDetail(card.tokenId, card.collectionId);
        card.itemInfo = itemEntity;
        res.status(200).send({ status: true, card: card })
      })
  },

  // staking
  getStakings: async function (req, res, next) {
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 6;
    delete req.query.limitNum;

    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    delete req.query.page;
    let skip = (page - 1) * limitNum;

    var account = req.query.account;
    delete req.query.account;
    if (account) {
      account = account.toLowerCase();
    }

    var stakedOnly = req.query.stakedOnly ? !!JSON.parse(String(req.query.stakedOnly).toLowerCase()) : false;;
    delete req.query.stakedOnly;
    let stakedQuery = {}
    if (stakedOnly == true) {
      if (account) {
        stakedQuery["stakedInfo.owner"] = account;
      } else {
        return res.status(200).send({ status: false, message: "missing account params" });
      }
    }

    var creatorAddress = req.query.creatorAddress;
    if (creatorAddress) {
      req.query.creatorAddress = creatorAddress.toLowerCase();
    }

    const currentTimeStamp = Math.floor(Date.now() / 1000);
    var finishStatus = req.query.finishStatus ? !!JSON.parse(String(req.query.finishStatus).toLowerCase()) : false;
    delete req.query.finishStatus;
    if (finishStatus) {
      req.query.endTime = { $lt: currentTimeStamp }
    } else {
      req.query.endTime = { $gt: currentTimeStamp }
    }

    var sortBy = req.query.sortBy;
    delete req.query.sortBy;
    let sort = {};
    if (sortBy === "hot") {
      sort = { endTime: 1 };
    } else if (sortBy === "apr") {
      sort = { apr: -1 };
    } else if (sortBy === "total_staked") {
      sort = { totalStakedNfts: -1 };
    }

    const aggregateQuery = [
      {
        $match: req.query
      },
      {
        $lookup: {
          from: "stakeditems",
          localField: "address",
          foreignField: "stakingAddress",
          as: "stakedInfo"
        }
      },
      {
        $match: stakedQuery
      },
      {
        $project: { stakedInfo: 0 }
      },
      {
        $sort: sort
      },
      {
        $limit: skip + limitNum
      },
      {
        $skip: skip
      }
    ];

    let ret = [];
    const stakings = await Staking.aggregate(aggregateQuery);
    if (stakings && stakings.length > 0) {
      for (let index = 0; index < stakings.length; index++) {
        let staking = stakings[index];
        if (account) {
          // set staked nfts
          let stakeditems = await StakedItem.find({ stakingAddress: staking.address, owner: account, amount: { $gt: 0 } }, { __v: 0, _id: 0 }).sort({ amount: -1 }).lean();
          if (stakeditems && stakeditems.length > 0) {
            for (let i = 0; i < stakeditems.length; i++) {
              const stakeditem = stakeditems[i];
              var itemInfo = await Item.findOne({ itemCollection: stakeditem.stakeNftAddress, tokenId: stakeditem.tokenId }, { __v: 0, _id: 0 }).lean();
              if (itemInfo) {
                stakeditem.itemInfo = itemInfo;
              }
            }
          }
          staking.stakeditems = stakeditems;

          // set owned nfts
          const nftMatchQuery = {};
          nftMatchQuery.itemCollection = staking.stakeNftAddress;
          nftMatchQuery["holders.address"] = account;
          nftMatchQuery["holders.balance"] = { $gt: 0 };

          let owneditems = await Item.find(nftMatchQuery, { __v: 0, _id: 0 }).sort({ timestamp: -1 }).lean();
          staking.owneditems = owneditems;

          // set collection info
          let itemCollection = ItemCollection.findOne({ address: staking.stakeNftAddress }, { __v: 0, _id: 0 }).lean();
          staking.collectionInfo = itemCollection;
        }
        ret.push(staking);
      }
    }

    const totalQuery = [
      {
        $match: req.query
      },
      {
        $lookup: {
          from: "stakeditems",
          localField: "address",
          foreignField: "stakingAddress",
          as: "stakedInfo"
        }
      },
      {
        $match: stakedQuery
      },
      {
        $project: { stakedInfo: 0 }
      },
      {
        $group: {
          _id: null,
          totalCount: {
            $sum: 1
          }
        }
      }
    ];
    let count = 0;
    const totalInfos = await Staking.aggregate(totalQuery);
    if (totalInfos && totalInfos?.length > 0) {
      count = totalInfos[0].totalCount;
    }

    if (count > 0) {
      res.status(200).send({ status: true, stakings: ret, count: count });
    } else {
      return res.status(200).send({ status: false, message: "No Stakings found" });
    }
  },
  stakingDetail: async function (req, res) {
    if (!req.query.address)
      return res.status(200).send({ status: false, message: "missing address" });
    let address = req.query.address.toLowerCase();

    var account = req.query.account;
    delete req.query.account;
    if (account) {
      account = account.toLowerCase();
    }

    Staking.findOne(
      { address: address },
      { __v: 0, _id: 0 }
    )
      .lean()
      .exec(async function (err, staking) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!staking) return res.status(200).send({ status: false, message: "No staking found" });

        //set up collection
        var collection = await ItemCollection.findOne({ address: staking.stakeNftAddress }, { _id: 0, __v: 0 }).lean();
        staking.collectionInfo = collection;

        if (account) {
          // set staked nfts
          let stakeditems = await StakedItem.find({ stakingAddress: staking.address, owner: account, amount: { $gt: 0 } }, { __v: 0, _id: 0 }).sort({ amount: -1 }).lean();
          if (stakeditems && stakeditems.length > 0) {
            for (let i = 0; i < stakeditems.length; i++) {
              const stakeditem = stakeditems[i];
              var itemInfo = await Item.findOne({ itemCollection: stakeditem.stakeNftAddress, tokenId: stakeditem.tokenId }, { __v: 0, _id: 0 }).lean();
              if (itemInfo) {
                stakeditem.itemInfo = itemInfo;
              }
            }
          }
          staking.stakeditems = stakeditems;

          // set owned nfts
          const nftMatchQuery = {};
          nftMatchQuery.itemCollection = staking.stakeNftAddress;
          nftMatchQuery["holders.address"] = account;
          nftMatchQuery["holders.balance"] = { $gt: 0 };

          let owneditems = await Item.find(nftMatchQuery, { __v: 0, _id: 0 }).sort({ timestamp: -1 }).lean();
          staking.owneditems = owneditems;
        }
        res.status(200).send({ status: true, staking: staking });
      });
  },

  // search
  searchCollections: async function (req, res, next) {
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 12;

    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limitNum;

    const search = req.query.search;

    let dataQuery = {};
    if (search) {
      dataQuery = { $text: { $search: search } }
    }

    dataQuery = {
      $and: [
        { isSynced: true },
        { visibility: true },
        dataQuery
      ]
    };


    ItemCollection.find(dataQuery, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .exec(async function (err, collections) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!collections) return res.status(200).send({ status: false, message: "No Collections found" });

        let ret = [];

        let addresses = [];
        for (let index = 0; index < collections.length; index++) {
          const collection = collections[index];
          addresses.push(collection.ownerAddress);
        }
        const users = await User.find({ address: { $in: addresses } });

        for (let i = 0; i < collections.length; i++) {
          let collection = collections[i];
          let ownerUsers = users.filter(user => user.address === collection.ownerAddress);
          if (ownerUsers && ownerUsers.length > 0) {
            collection.ownerUser = ownerUsers[0];
          } else {
            collection.ownerUser = {
              address: collection.ownerAddress,
              name: "NoName",
              originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
            };
          }
          ret.push(collection)
        }

        ItemCollection.countDocuments(dataQuery, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, collections: ret, count: count });
        });
      });
  },

  searchItems: async function (req, res, next) {
    const that = this;
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 12;

    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limitNum;

    const search = req.query.search;

    let dataQuery = {};
    if (search) {
      dataQuery = { $text: { $search: search } }
    }

    Item.find(dataQuery, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .exec(async function (err, items) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!items) return res.status(200).send({ status: false, message: "No Items found" });

        Item.countDocuments(dataQuery, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, items: items, count: count });
        });
      });
  },

  searchUsers: async function (req, res, next) {
    let limitNum = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 12;

    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limitNum;

    const search = req.query.search;

    let dataQuery = {};
    if (search) {
      dataQuery = { $text: { $search: search } }
    }

    User.find(dataQuery, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .exec(async function (err, users) {
        if (err) return res.status(200).send({ status: false, message: err.message });
        if (!users) return res.status(200).send({ status: false, message: "No Users found" });

        User.countDocuments(dataQuery, function (err2, count) {
          if (err2) return res.status(200).send({ status: false, message: err2.message });
          res.status(200).send({ status: true, users: users, count: count });
        });
      });
  },

  // get overview
  getOverview: async function (req, res, next) {
    // get coin price
    let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });

    // get total volume 
    const totalVolumeQuery = [
      {
        $group: {
          _id: null,
          tradingVolume: {
            $sum: '$usdVolume'
          },
          tradingCount: {
            $sum: '$amount'
          }
        }
      }
    ];
    let tradingVolume = 0;
    let tradingCount = 0;
    const tradingVolumeInfos = await Sold.aggregate(totalVolumeQuery);
    if (tradingVolumeInfos && tradingVolumeInfos?.length > 0) {
      tradingVolume = tradingVolumeInfos[0].tradingVolume;
      tradingCount = tradingVolumeInfos[0].tradingCount;
    }

    // get total collection
    let collectionCount = await ItemCollection.countDocuments({});

    // get total items
    let itemCount = await Item.countDocuments({});

    // get total users
    let userCount = await User.countDocuments({});

    let gas = await Gas.findOne({});
    res.status(200).send({
      status: true,
      overview: {
        collectionCount: collectionCount,
        itemCount: itemCount,
        userCount: userCount,
        tradingVolume: tradingVolume,
        tradingCount: tradingCount,
        coinPrice: token.rate,
        gasUsed: gas.total
      }
    });
  },




  // manage request query
  handleItemGetRequest: function (req, limit) {
    delete req.query.limit;

    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;

    let sortDir =
      req.query.sortDir === "asc" || req.query.sortDir === "desc"
        ? req.query.sortDir
        : "desc";

    const sortBy =
      req.query.sortBy === "name" ||
        req.query.sortBy === "likeCount" ||
        req.query.sortBy === "usdPrice" ||
        req.query.sortBy === "timestamp"
        ? req.query.sortBy
        : "timestamp";

    delete req.query.page;
    delete req.query.sortBy;
    delete req.query.sortDir;

    if (sortDir === "asc") sortDir = 1;
    else if (sortDir === "desc") sortDir = -1;

    let sort;
    if (sortBy === "name") {
      sort = { name: sortDir };
    } else if (sortBy === "likeCount") {
      sort = { likeCount: sortDir };
    } else if (sortBy === "usdPrice") {
      sort = { usdPrice: sortDir };
    } else {
      sort = { blockNumber: sortDir };
    }

    if (req.query.likes) {
      req.query.likes = req.query.likes.toLowerCase();
    }

    if (req.query.owner) {
      req.query["holders.address"] = req.query.owner.toLowerCase();
      delete req.query.owner;
    }

    if (req.query.itemCollection) {
      req.query.itemCollection = req.query.itemCollection.toLowerCase();
    }

    var saleType = req.query.saleType;
    delete req.query.saleType;

    if (saleType == "auction") {
      req.query.marketList = "auction";
    } else if (saleType == "fixed") {
      req.query.marketList = "pair";
    } else if (saleType == "all") {
      req.query.marketList = { $in: ["auction", "pair"] };
    } else if (saleType == "not_sale") {
      req.query.marketList = { $nin: ["auction", "pair"] };
      // req.query.marketList = ''
    }
    req.query.isSynced = true;
    req.query.visibility = true;

    const searchTxt = req.query.searchTxt;
    delete req.query.searchTxt;
    if (searchTxt) {
      req.query = {
        $and: [
          req.query,
          { $text: { $search: searchTxt } }
        ]
      };      
    }

    if (req.query.attributes) {
      let attributeQuery = []
      let attributes = JSON.parse(req.query.attributes);
      delete req.query.attributes
      for (let index = 0; index < attributes.length; index++) {
        const attribute = attributes[index];
        attributeQuery.push({
          attributes: { $elemMatch: { trait_type: attribute.trait_type, value: { $in: attribute.values } } }
        })
        // req.query.attributes = { $elemMatch: { trait_type: attribute.trait_type, value: attribute.value } }
      }
      req.query = {
        $and: [
          req.query,
          { $and: attributeQuery }
        ]
      };
    }

    return { query: req.query, sort: sort, skip: skip };
  },

  handleEventGetRequest: function (req, limit) {
    delete req.query.limit;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;
    delete req.query.page;

    if (req.query.itemCollection) {
      req.query.itemCollection = req.query.itemCollection.toLowerCase();
    }

    var address = req.query.address;
    delete req.query.address;
    if (address) {
      req.query['$or'] = [
        { from: address.toLowerCase() },
        { to: address.toLowerCase() }
      ];
    }

    var filter = req.query.filter;
    delete req.query.filter;
    if (filter) {
      var filters = filter.split("_");
      req.query.name = { $in: filters };
    }

    return { query: req.query, skip: skip };
  },

  handleMysteryBoxGetRequest: function (req, limit) {
    delete req.query.limit;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;

    let sortDir =
      req.query.sortDir === "asc" || req.query.sortDir === "desc"
        ? req.query.sortDir
        : "desc";

    const sortBy =
      req.query.sortBy === "timestamp" ||
        req.query.sortBy === "cardAmount"
        ? req.query.sortBy
        : "cardAmount";

    delete req.query.page;
    delete req.query.sortBy;
    delete req.query.sortDir;

    if (sortDir === "asc") sortDir = 1;
    else if (sortDir === "desc") sortDir = -1;

    let sort;
    if (sortBy === "timestamp") {
      sort = { timestamp: sortDir };
    } else {
      sort = { cardAmount: sortDir };
    }

    if (req.query.owner) {
      req.query.owner = req.query.owner.toLowerCase();
    }

    req.query.status = true;
    req.query.visible = true;

    const searchTxt = req.query.searchTxt;
    delete req.query.searchTxt;
    if (searchTxt) {
      req.query = {
        $and: [
          req.query,
          { $text: { $search: searchTxt } }
        ]
      };
    }

    return { query: req.query, sort: sort, skip: skip };
  },

  handleCardGetRequest: function (req, limit) {
    delete req.query.limit;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;

    let sortDir =
      req.query.sortDir === "asc" || req.query.sortDir === "desc"
        ? req.query.sortDir
        : "desc";

    const sortBy =
      req.query.sortBy === "timestamp" ||
        req.query.sortBy === "amount"
        ? req.query.sortBy
        : "timestamp";

    delete req.query.page;
    delete req.query.sortBy;
    delete req.query.sortDir;

    if (sortDir === "asc") sortDir = 1;
    else if (sortDir === "desc") sortDir = -1;

    let sort;
    if (sortBy === "amount") {
      sort = { amount: sortDir };
    } else {
      sort = { timestamp: sortDir };
    }

    if (req.query.mysteryboxAddress) {
      req.query.mysteryboxAddress = req.query.mysteryboxAddress.toLowerCase();
    }
    req.query.amount = { $gt: 0 };

    return { query: req.query, sort: sort, skip: skip };
  },

  // get nft detail from tokenId and collection address
  getItemDetail: async function (tokenId, itemCollection) {
    const item = await Item.findOne({ tokenId: tokenId, itemCollection: itemCollection }, { __v: 0, _id: 0 }).lean();
    if (!item) return null
    var supply = 0;
    for (let index = 0; index < item.holders.length; index++) {
      const holdElement = item.holders[index];
      supply = supply + holdElement.balance;
    }
    item.supply = supply;

    //set up pair information    

    const firstPairs = await Pair.find({ tokenId: tokenId, itemCollection: itemCollection }, { _id: 0, __v: 0 }).sort({ usdPrice: 1 }).limit(1).lean();
    if (firstPairs && firstPairs?.length > 0) {
      item.pairInfo = firstPairs[0];
    }

    //set up auction information
    var auction = await Auction.findOne({ tokenId: tokenId, itemCollection: itemCollection }, { _id: 0, __v: 0 }).lean();
    if (auction) {
      auction.price = auction.startPrice;
      let bids = await Bid.find({ auctionId: auction.auctionId }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).limit(1).lean();
      auction.bids = bids
      if (bids.length > 0) {
        auction.price = bids[0].bidPrice
      }
      item.auctionInfo = auction;
    }

    //set up collection
    var collection = await ItemCollection.findOne({ address: itemCollection }, { _id: 0, __v: 0 }).lean();
    item.collectionInfo = collection;

    return item
  },

  updateSold: async function (req, res, next) {
    Sold.find({}, { _id: 0, __v: 0 }, async (err, solds) => {
      if (err) return res.status(200).send({ status: false, message: err.message });
      if (!solds) return res.status(200).send({ status: false, message: "No Sold event found" })

      for (let index = 0; index < solds.length; index++) {
        const sold = solds[index];

        var dateObj = new Date(sold.timestamp * 1000);
        var year = dateObj.getUTCFullYear();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var usdVolume = sold.usdPrice * sold.amount;

        await Sold.findOneAndUpdate({ itemCollection: sold.itemCollection, tokenId: sold.tokenId, timestamp: sold.timestamp, seller: sold.seller }, {
          year: year,
          month: month,
          day: day,
          usdVolume: usdVolume
        }, { new: true, upsert: true })

      }
      res.status(200).send({ status: true, message: 'success' });
    })
  },

});

