const mongoose = require('mongoose');
const ethers = require('ethers');
const fs = require('fs');
var ethSignUtil = require('eth-sig-util');
var ethereumjsUtil = require('ethereumjs-util');

const config = require('../config');
const BaseController = require('./BaseController');
const Auction = require("../models/auction.model");
const Bid = require("../models/bid.model");
const Pair = require("../models/pair.model");
const Event = require("../models/event.model");
const Token = require("../models/token.model");
const Item = require("../models/item.model");
const ItemCollection = require("../models/collection.model");

const getContractABI = (name) => {
    return JSON.parse(fs.readFileSync(`./abis/${name}.json`));
}
const provider = new ethers.providers.JsonRpcProvider(process.env.APP_RPC);

module.exports = BaseController.extend({
    name: 'MarketController',

    createAuction: async function (req, res, next) {
        let { itemCollection, tokenId, startTime, endTime, tokenAdr, startPrice, owner, signature } = req.body;
        // check params validation
        if (!itemCollection || !tokenId || !startTime || !endTime || !tokenAdr || !startPrice || !owner || !signature) {
            return res.status(200).send({ status: false, message: 'invalid params' });
        }

        // check out startPrice validation
        if (Number(startPrice) <= 0) {
            return res.status(200).send({ status: false, message: 'invaild start price' });
        }

        // checkout timestamp validation
        if (Number(startTime) > Number(endTime)) {
            return res.status(200).send({ status: false, message: 'invaild timestamp' });
        }
        const currentTime = Date.now();
        const currentTimeStamp = Math.floor(currentTime / 1000);
        if (currentTimeStamp > Number(endTime)) {
            return res.status(200).send({ status: false, message: 'end timestamp have to be bigger than current timestamp' });
        }

        // check out collection validation
        let collectionEntity = await ItemCollection.findOne({ address: itemCollection.toLowerCase() });
        if (!collectionEntity) {
            return res.status(200).send({ status: false, message: 'invalid collection address' });
        }
        if (!collectionEntity.visibility) {
            return res.status(200).send({ status: false, message: 'collection is not available now' });
        }
        if (collectionEntity.type !== 'single') {
            return res.status(200).send({ status: false, message: 'invalid collection type' });
        }

        // check out nft ownership and approved status
        var nftContract = new ethers.Contract(itemCollection.toLowerCase(), getContractABI('SingleNFT'), provider);
        const tokenOwner = await nftContract.ownerOf(tokenId);
        if (tokenOwner.toLowerCase() !== owner.toLowerCase()) {
            return res.status(200).send({ status: false, message: 'not token owner' });
        }
        const apporveStatus = await nftContract.isApprovedForAll(owner, config.marketplaceV2);
        if (!apporveStatus) {
            return res.status(200).send({ status: false, message: 'owner does not apporve nft in the marketplace contract' });
        }

        // check out auction was already created
        let auction = await Auction.findOne({ itemCollection: tokenOwner.toLowerCase(), tokenId: tokenId });
        if (auction) {
            return res.status(200).send({ status: false, message: 'auction is already created' });
        }

        let pair = await Pair.findOne({ itemCollection: tokenOwner.toLowerCase(), tokenId: tokenId });
        if (pair) {
            return res.status(200).send({ status: false, message: 'you already listed for this nft' });
        }

        // check out payment token validation
        let token = await Token.findOne({ address: tokenAdr.toLowerCase() });
        if (!token) {
            return res.status(200).send({ status: false, message: 'invalid token address' });
        }

        // check out signature validation
        const msg = `I want to create auction with this information: ${itemCollection}:${tokenId}:${startTime}:${endTime}:${tokenAdr}:${startPrice}:${owner}`;
        const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const publicAddress = ethSignUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        if (publicAddress.toLowerCase() !== owner.toLowerCase()) {
            return res.status(200).send({ status: false, message: 'invalid signature' });
        }

        // register auction
        const newAuction = new Auction({
            timestamp: currentTimeStamp,
            auctionId: currentTime,
            itemCollection: itemCollection.toLowerCase(),
            tokenId: tokenId,
            startTime: Number(startTime),
            endTime: Number(endTime),
            tokenAdr: tokenAdr.toLowerCase(),
            startPrice: Number(startPrice),
            owner: owner.toLowerCase(),
            usdPrice: Number(startPrice) * token.rate
        })
        await newAuction.save();

        // register event
        const newEvent = new Event({
            id: `${itemCollection.toLowerCase()}-${tokenId}-${currentTime}`,
            timestamp: currentTimeStamp,
            txhash: '',
            itemCollection: itemCollection.toLowerCase(),
            tokenId: tokenId,
            name: 'Auction Created',
            from: owner.toLowerCase(),
            to: '',
            tokenAdr: tokenAdr.toLowerCase(),
            price: Number(startPrice),
            amount: 1
        })
        await newEvent.save();

        //update marketList & usdPrice in item model
        await this.updateItem(itemCollection.toLowerCase(), tokenId, currentTimeStamp);
        return res.status(200).send({ status: true, message: 'auction created' });
    },

    bidOnAuction: async function (req, res, next) {
        let { auctionId, bidPrice, account, signature } = req.body;
        if (!auctionId || !bidPrice || !account || !signature) {
            return res.status(200).send({ status: false, message: 'invalid params' });
        }

        // check out auctionid
        let auction = await Auction.findOne({ auctionId: Number(auctionId) });
        if (!auction) {
            return res.status(200).send({ status: false, message: "invalid productId" });
        }

        // check out bidablity
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        if (currentTimeStamp > auction.endTime) {
            return res.status(200).send({ status: false, message: 'auction is over' });
        }
        if (currentTimeStamp < auction.startTime) {
            return res.status(200).send({ status: false, message: 'auction is not started' });
        }

        // check out bid price
        if (Number(bidPrice) < auction.startPrice) {
            return res.status(200).send({ status: false, message: 'invalid bid price' });
        }

        let bids = await Bid.find({ auctionId: Number(auctionId) }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).limit(10).lean();
        if (bids.length > 0) {
            if (Number(bidPrice) < (bids[0].bidPrice * 1.05)) {
                return res.status(200).send({ status: false, message: 'bid price must be at least 5% greater than the last price.' });
            }
        }

        // checkout balance
        var tokenContract = new ethers.Contract(auction.tokenAdr, getContractABI('Token'), provider);
        let token = await Token.findOne({ address: auction.tokenAdr });
        let balance = await tokenContract.balanceOf(account);
        if (parseFloat(ethers.utils.formatUnits(balance, token.decimal)) < Number(bidPrice)) {
            return res.status(200).send({ status: false, message: 'insufficiant balance' });
        }

        // checkout allownce
        const allowance = await tokenContract.allowance(account, config.marketplaceV2);
        if (parseFloat(ethers.utils.formatUnits(allowance, token.decimal)) < Number(bidPrice)) {
            return res.status(200).send({ status: false, message: 'insufficiant allowance' });
        }

        // check out signature        
        const msg = `I want to bid on auction with this information: ${auctionId}:${bidPrice}:${account}`;

        const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const publicAddress = ethSignUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        if (publicAddress.toLowerCase() !== account.toLowerCase()) {
            return res.status(200).send({ status: false, message: 'invalid signature' });
        }

        // register bid
        const newBid = new Bid({
            timestamp: currentTimeStamp,
            itemCollection: auction.itemCollection,
            tokenId: auction.tokenId,
            auctionId: Number(auctionId),
            from: account.toLowerCase(),
            tokenAdr: auction.tokenAdr,
            bidPrice: Number(bidPrice),
        })
        await newBid.save();

        // register bid event
        const newEvent = new Event({
            id: `${auction.itemCollection}-${auction.tokenId}-${currentTimeStamp}`,
            timestamp: currentTimeStamp,
            txhash: '',
            itemCollection: auction.itemCollection,
            tokenId: auction.tokenId,
            name: 'Bid',
            from: account.toLowerCase(),
            to: '',
            tokenAdr: auction.tokenAdr,
            price: Number(bidPrice),
            amount: 1
        })
        await newEvent.save();

        //update marketList & usdPrice in item model
        await this.updateItem(auction.itemCollection, auction.tokenId, currentTimeStamp);
        return res.status(200).send({ status: true, message: 'bid created' });
    },

    cancelAuction: async function (req, res, next) {
        let { auctionId, account, signature } = req.body;
        if (!auctionId || !account || !signature) {
            return res.status(200).send({ status: false, message: 'invalid params' });
        }

        // check out auctionid
        let auction = await Auction.findOne({ auctionId: Number(auctionId) });
        if (!auction) {
            return res.status(200).send({ status: false, message: "invalid productId" });
        }

        // check out account is owner of the auction
        if (auction.owner !== account.toLowerCase()) {
            return res.status(200).send({ status: false, message: "only auction owner can cancel the auction" });
        }

        // check already bidded
        let bids = await Bid.find({ auctionId: Number(auctionId) }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).limit(10).lean();
        if (bids.length > 0) {
            return res.status(200).send({ status: false, message: 'You can not cancel auction. because someone bid on this auction already!' });
        }

        // check out signature        
        const msg = `I want to cancel auction with this information: ${auctionId}:${account}`;

        const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const publicAddress = ethSignUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        if (publicAddress.toLowerCase() !== account.toLowerCase()) {
            return res.status(200).send({ status: false, message: 'invalid signature' });
        }

        // remove auction
        await Auction.findOneAndDelete({ auctionId: Number(auctionId) });

        // register cancel auction event
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        const newEvent = new Event({
            id: `${auction.itemCollection}-${auction.tokenId}-${currentTimeStamp}`,
            timestamp: currentTimeStamp,
            txhash: '',
            itemCollection: auction.itemCollection,
            tokenId: auction.tokenId,
            name: 'Auction Canceled',
            from: account.toLowerCase(),
            to: '',
            tokenAdr: '',
            price: 0,
            amount: 1
        })
        await newEvent.save();

        //update marketList & usdPrice in item model
        await this.updateItem(auction.itemCollection, auction.tokenId, currentTimeStamp);
        return res.status(200).send({ status: true, message: 'bid created' });
    },

    createPair: async function (req, res, next) {
        let { itemCollection, tokenId, tokenAdr, amount, price, owner, signature } = req.body;
        // check params validation
        if (!itemCollection || !tokenId || !tokenAdr || !amount || !price || !owner || !signature) {
            return res.status(200).send({ status: false, message: 'invalid params' });
        }

        // check out price validation
        if (Number(price) <= 0) {
            return res.status(200).send({ status: false, message: 'invaild price' });
        }

        // check out collection validation
        let collectionEntity = await ItemCollection.findOne({ address: itemCollection.toLowerCase() });
        if (!collectionEntity) {
            return res.status(200).send({ status: false, message: 'invalid collection address' });
        }
        if (!collectionEntity.visibility) {
            return res.status(200).send({ status: false, message: 'collection is not available now' });
        }

        // check out nft ownership and approved status
        let ownedAmount = 0
        if (collectionEntity.type === 'single') {
            var nftContract = new ethers.Contract(itemCollection.toLowerCase(), getContractABI('SingleNFT'), provider);
            const tokenOwner = await nftContract.ownerOf(tokenId);
            if (tokenOwner.toLowerCase() !== owner.toLowerCase()) {
                return res.status(200).send({ status: false, message: 'not token owner' });
            }
            if (Number(amount) !== 1) {
                return res.status(200).send({ status: false, message: 'invalid amount' });
            }
            const apporveStatus = await nftContract.isApprovedForAll(owner, config.marketplaceV2);
            if (!apporveStatus) {
                return res.status(200).send({ status: false, message: 'owner does not apporve nft in the marketplace contract' });
            }
            ownedAmount = 1;
        } else {
            var nftContract = new ethers.Contract(itemCollection.toLowerCase(), getContractABI('MultipleNFT'), provider);
            const nftBalance = await nftContract.balanceOf(owner.toLowerCase(), tokenId);
            if (Number(nftBalance) < Number(amount)) {
                return res.status(200).send({ status: false, message: 'insufficiant nft balance' });
            }
            const apporveStatus = await nftContract.isApprovedForAll(owner, config.marketplaceV2);
            if (!apporveStatus) {
                return res.status(200).send({ status: false, message: 'owner does not apporve nft in the marketplace contract' });
            }
            ownedAmount = Number(nftBalance);
        }

        // check out payment token validation
        let token = await Token.findOne({ address: tokenAdr.toLowerCase() });
        if (!token) {
            return res.status(200).send({ status: false, message: 'invalid token address' });
        }

        // check out signature validation
        const msg = `I want to create pair with this information: ${itemCollection}:${tokenId}:${tokenAdr}:${amount}:${price}:${owner}`;
        const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const publicAddress = ethSignUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        if (publicAddress.toLowerCase() !== owner.toLowerCase()) {
            return res.status(200).send({ status: false, message: 'invalid signature' });
        }

        // get summary
        const pairQuery = [
            {
                $match: {
                    'tokenId': tokenId,
                    'itemCollection': itemCollection,
                    'owner': owner.toLowerCase()
                }
            },
            {
                $group: {
                    _id: {
                        'itemCollection': '$itemCollection',
                        'tokenId': '$tokenId'
                    },
                    totalListed: {
                        $sum: '$balance'
                    },
                }
            },

        ];

        const pairSummary = await Pair.aggregate(pairQuery);
        if (pairSummary && pairSummary.length > 0) {
            let listedAmount = pairSummary[0].totalListed;            
            if (ownedAmount < listedAmount + Number(amount)) {
                return res.status(200).send({ status: false, message: 'insufficiant nft balance' });
            }
        }
        

        // register pair

        const currentTime = Date.now();
        const currentTimeStamp = Math.floor(currentTime / 1000);

        const newPair = new Pair({
            timestamp: currentTimeStamp,
            pairId: currentTime,
            itemCollection: itemCollection.toLowerCase(),
            tokenId: tokenId,
            type: collectionEntity.type,
            owner: owner.toLowerCase(),
            tokenAdr: tokenAdr.toLowerCase(),
            balance: Number(amount),
            price: Number(price),
            usdPrice: Number(price) * token.rate
        })
        await newPair.save();

        // register event
        const newEvent = new Event({
            id: `${itemCollection.toLowerCase()}-${tokenId}-${currentTime}`,
            timestamp: currentTimeStamp,
            txhash: '',
            itemCollection: itemCollection.toLowerCase(),
            tokenId: tokenId,
            name: 'Listed',
            from: owner.toLowerCase(),
            to: '',
            tokenAdr: tokenAdr.toLowerCase(),
            price: Number(price),
            amount: Number(amount)
        })
        await newEvent.save();

        //update marketList & usdPrice in item model
        await this.updateItem(itemCollection.toLowerCase(), tokenId, currentTimeStamp);
        return res.status(200).send({ status: true, message: 'pair created' });
    },

    delistPair: async function (req, res, next) {
        let { pairId, account, signature } = req.body;
        if (!pairId || !account || !signature) {
            return res.status(200).send({ status: false, message: 'invalid params' });
        }

        // check out auctionid
        let pair = await Pair.findOne({ pairId: Number(pairId) });
        if (!pair) {
            return res.status(200).send({ status: false, message: "invalid pairId" });
        }

        // check out account is owner of the auction
        if (pair.owner !== account.toLowerCase()) {
            return res.status(200).send({ status: false, message: "only owner can delist pair" });
        }

        // check out signature        
        const msg = `I want to cancel pair with this information: ${pairId}:${account}`;

        const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const publicAddress = ethSignUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        if (publicAddress.toLowerCase() !== account.toLowerCase()) {
            return res.status(200).send({ status: false, message: 'invalid signature' });
        }

        // remove pair
        await Pair.findOneAndDelete({ pairId: Number(pairId) });

        // register delist event
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        const newEvent = new Event({
            id: `${pair.itemCollection}-${pair.tokenId}-${currentTimeStamp}`,
            timestamp: currentTimeStamp,
            txhash: '',
            itemCollection: pair.itemCollection,
            tokenId: pair.tokenId,
            name: 'Delist',
            from: account.toLowerCase(),
            to: '',
            tokenAdr: '',
            price: 0,
            amount: pair.balance
        })
        await newEvent.save();

        //update marketList & usdPrice in item model
        await this.updateItem(pair.itemCollection, pair.tokenId, currentTimeStamp);
        return res.status(200).send({ status: true, message: 'pair delisted' });
    },


    updateItem: async function (itemCollection, tokenId, timestamp) {
        let item = await Item.findOne({ tokenId: tokenId, itemCollection: itemCollection }).lean();
        if (!item) {
            return;
        }
        let marketList = [];
        let usdPrice = 0;
        // update item(tokenId, itemCollection) usdPrice
        var auction = await Auction.findOne({ tokenId: tokenId, itemCollection: itemCollection });
        if (auction) {
            usdPrice = auction.usdPrice;
            marketList.push('auction');
        }

        // check out min pair price.
        const firstPairQuery = [
            {
                $match: {
                    'tokenId': tokenId,
                    'itemCollection': itemCollection
                }
            },
            {
                $sort: {
                    usdPrice: 1
                }
            },
            {
                $limit: 1
            }
        ];

        const firstPairs = await Pair.aggregate(firstPairQuery);
        if (firstPairs && firstPairs?.length > 0) {
            if (usdPrice > 0) {
                usdPrice = Math.min(usdPrice, firstPairs[0].usdPrice);
            } else {
                usdPrice = firstPairs[0].usdPrice;
            }
            marketList.push('pair');
        }


        await Item.findOneAndUpdate({ tokenId: tokenId, itemCollection: itemCollection }, {
            timestamp: timestamp,
            marketList: marketList,
            usdPrice: usdPrice
        });
    }
});
