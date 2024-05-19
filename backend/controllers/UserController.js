const mongoose = require('mongoose');
var ethSignUtil = require('eth-sig-util');
var ethereumjsUtil = require('ethereumjs-util');

const BaseController = require('./BaseController');
const User = require("../models/user.model");
const Sold = require("../models/sold.model");
const Token = require('../models/token.model');
const Auction = require("../models/auction.model");
const Pair = require("../models/pair.model");
const Item = require("../models/item.model");
const Follow = require("../models/follow.model");
const { isAddress } = require('ethers/lib/utils');
const config = require('../config');
const { ethers } = require('ethers');

module.exports = BaseController.extend({
    name: 'UserController',

    get: async function (req, res, next) {
        if (!req.params.address) {
            return res.status(200).send({ status: false, message: "invailid user address" });
        }
        let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });

        // get trading information
        const soldQuery = [
            {
                $match: {
                    seller: req.params.address.toLowerCase()
                }
            },
            {
                $group: {
                    _id: '$seller',
                    tradingVolume: {
                        $sum: '$usdVolume'
                    },
                    tradingCount: {
                        $sum: '$amount'
                    },
                }
            },
        ];
        let tradingInfo = {
            tradingVolume: 0,
            tradingCount: 0,
            floorPrice: 0,
            coinPrice: token.rate
        }

        const tradingInfos = await Sold.aggregate(soldQuery);
        if (tradingInfos && tradingInfos?.length > 0) {
            tradingInfo.tradingVolume = tradingInfos[0].tradingVolume;
            tradingInfo.tradingCount = tradingInfos[0].tradingCount;
            tradingInfo.floorPrice = tradingInfos[0].tradingVolume / tradingInfos[0].tradingCount;
        }

        // get last pair.
        const lastPair = await Pair.find({ owner: req.params.address.toLowerCase() }, { _id: 0, __v: 0 }).sort({ timestamp: -1 }).limit(1).lean();

        // get last auction.
        const lastAuction = await Auction.find({ owner: req.params.address.toLowerCase() }, { _id: 0, __v: 0 }).sort({ timestamp: -1 }).limit(1).lean();

        // get last sold.
        const lastSold = await Sold.find({ seller: req.params.address.toLowerCase() }, { _id: 0, __v: 0 }).sort({ timestamp: -1 }).limit(1).lean();

        // get follow count
        const followerCount = await Follow.countDocuments({
            to: req.params.address.toLowerCase()
        });
        const followingCount = await Follow.countDocuments({
            from: req.params.address.toLowerCase()
        });
        const followCount = {
            follower: followerCount,
            following: followingCount
        }


        const user = await User.findOne({ address: req.params.address.toLowerCase() }, { _id: 0, __v: 0 }).lean();
        if (user) {
            user.tradingInfo = tradingInfo;
            user.followCount = followCount;
            if (lastPair && lastPair?.length > 0) {
                let pairInfo = lastPair[0];
                const itemInfo = await Item.findOne({ tokenId: pairInfo.tokenId, itemCollection: pairInfo.itemCollection }, { _id: 0, __v: 0 }).lean();
                pairInfo.itmeInfo = itemInfo;
                user.pairInfo = pairInfo;
            }
            if (lastAuction && lastAuction?.length > 0) {
                let auctionInfo = lastAuction[0];
                const itemInfo = await Item.findOne({ tokenId: auctionInfo.tokenId, itemCollection: auctionInfo.itemCollection }, { _id: 0, __v: 0 }).lean();
                auctionInfo.itmeInfo = itemInfo;
                user.auctionInfo = auctionInfo;

            }
            if (lastSold && lastSold?.length > 0) {
                let soldInfo = lastSold[0];
                const itemInfo = await Item.findOne({ tokenId: soldInfo.tokenId, itemCollection: soldInfo.itemCollection }, { _id: 0, __v: 0 }).lean();
                soldInfo.itmeInfo = itemInfo;
                user.soldInfo = soldInfo;
            }

            res.status(200).send({ status: true, user: user })
        } else {
            let ensName = ""
            if (isAddress(req.params.address.toLowerCase())) {
                const provider = new ethers.providers.JsonRpcProvider(config.mainnet_public_rpc_node);
                ensName = await provider.lookupAddress(req.params.address.toLowerCase())
            }
            let newUser = {
                address: req.params.address.toLowerCase(),
                ensName: ensName || "",
                name: "NoName",
                originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                nonce: Math.floor(Math.random() * 1000000)
            };
            const newUserItem = new User(newUser)
            await newUserItem.save();

            newUser.tradingInfo = tradingInfo;
            newUser.followCount = followCount;
            if (lastPair && lastPair?.length > 0) {
                let pairInfo = lastPair[0];
                const itemInfo = await Item.findOne({ tokenId: pairInfo.tokenId, itemCollection: pairInfo.itemCollection }, { _id: 0, __v: 0 }).lean();
                pairInfo.itmeInfo = itemInfo;
                newUser.pairInfo = pairInfo;
            }
            if (lastAuction && lastAuction?.length > 0) {
                let auctionInfo = lastAuction[0];
                const itemInfo = await Item.findOne({ tokenId: auctionInfo.tokenId, itemCollection: auctionInfo.itemCollection }, { _id: 0, __v: 0 }).lean();
                auctionInfo.itmeInfo = itemInfo;
                newUser.auctionInfo = auctionInfo;

            }
            if (lastSold && lastSold?.length > 0) {
                let soldInfo = lastSold[0];
                const itemInfo = await Item.findOne({ tokenId: soldInfo.tokenId, itemCollection: soldInfo.itemCollection }, { _id: 0, __v: 0 }).lean();
                soldInfo.itmeInfo = itemInfo;
                newUser.soldInfo = soldInfo;
            }
            return res.status(200).send({ status: true, user: newUser })
        }
    },

    update: async function (req, res, next) {
        if (!req.body.address) return res.status(200).send({ status: false, message: "No address" })
        if (!req.body.signature) return res.status(200).send({ status: false, message: "No signature" })
        const name = req.body.name || "NoName"
        const bio = req.body.bio || ""
        const email = req.body.email || ""
        const twitter = req.body.twitter || ""
        const instagram = req.body.instagram || ""

        let originalLogo = ""
        if (req.files["originals"] && req.files["originals"][0]) originalLogo = req.files["originals"][0]?.location
        if (req.body.originalLogo) originalLogo = req.body.originalLogo

        let lowLogo = ""
        if (req.files["lows"] && req.files["lows"][0]) lowLogo = req.files["lows"][0]?.location
        if (req.body.lowLogo) lowLogo = req.body.lowLogo

        let mediumLogo = ""
        if (req.files["mediums"] && req.files["mediums"][0]) mediumLogo = req.files["mediums"][0]?.location
        if (req.body.mediumLogo) mediumLogo = req.body.mediumLogo

        let highLogo = ""
        if (req.files["highs"] && req.files["highs"][0]) highLogo = req.files["highs"][0]?.location
        if (req.body.highLogo) highLogo = req.body.highLogo

        let bannerUrl = ""
        if (req.files["banners"] && req.files["banners"][0]) bannerUrl = req.files["banners"][0]?.location
        if (req.body.bannerUrl) bannerUrl = req.body.bannerUrl

        User.findOne({ address: req.body.address.toLowerCase() }, async (err, user) => {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!user) return res.status(200).send({ status: false, message: "User not found" });

            // check out signature validation
            const msg = `I want to update my profile :${req.body.address.toLowerCase()}:${user.nonce}`;
            const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
            const publicAddress = ethSignUtil.recoverPersonalSignature({
                data: msgBufferHex,
                sig: req.body.signature,
            });

            if (publicAddress.toLowerCase() !== req.body.address.toLowerCase()) {
                return res.status(200).send({ status: false, message: 'invalid signature' });
            }

            if (name && name != undefined || name === "") user.name = name
            if (bio && bio != undefined || bio === "") user.bio = bio
            if (email && email != undefined || email === "") user.email = email
            if (twitter && twitter != undefined || twitter === "") user.twitter = twitter
            if (instagram && instagram != undefined || instagram === "") user.instagram = instagram
            user.originalLogo = originalLogo
            user.lowLogo = lowLogo
            user.mediumLogo = mediumLogo
            user.highLogo = highLogo
            user.bannerUrl = bannerUrl
            user.nonce = Math.floor(Math.random() * 1000000);
            await user.save();
            return res.status(200).send({ status: true, message: 'success' });
        })
    },

    follow: async function (req, res, next) {
        if (!req.body.from) return res.status(200).send({ status: false, message: "No From address" })
        if (!req.body.to) return res.status(200).send({ status: false, message: "No To address" })
        let fromAddress = req.body.from.toLowerCase();
        let toAddress = req.body.to.toLowerCase();

        const currentTimeStamp = Math.floor(Date.now() / 1000);

        var followItem = await Follow.findOne({ from: fromAddress, to: toAddress });
        if (followItem) {
            // unfollow                                     
            await Follow.findOneAndDelete({ from: fromAddress, to: toAddress });
            res.status(200).send({ result: 'success', message: 'unfollowed' });
        } else {
            // follow
            const followID = `${fromAddress}-${toAddress}`
            await Follow.findOneAndUpdate({ id: followID }, {
                id: followID,
                timestamp: currentTimeStamp,
                from: fromAddress,
                to: toAddress
            }, { new: true, upsert: true });
            res.status(200).send({ result: 'success', message: 'followed' });
        }
    },
    followingStatus: async function (req, res, next) {
        if (!req.query.from) return res.status(200).send({ status: false, message: "No From address" })
        if (!req.query.to) return res.status(200).send({ status: false, message: "No To address" })
        let fromAddress = req.query.from.toLowerCase();
        let toAddress = req.query.to.toLowerCase();

        var followItem = await Follow.findOne({ from: fromAddress, to: toAddress });
        if (followItem) {
            // followed  
            res.status(200).send({ following: true });
        } else {
            // not followed
            res.status(200).send({ following: false });
        }
    },

    getFollowers: async function (req, res, next) {
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = req.query.limit && parseInt(req.query.limit) ? parseInt(req.query.limit) : 12;
        let skip = (page - 1) * limit;

        if (!req.query.address) return res.status(200).send({ status: false, message: "No address" })
        let address = req.query.address.toLowerCase();

        Follow.find({ to: address }, { __v: 0, _id: 0 })
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip)
            .lean()
            .exec(async function (err, follows) {
                if (err) return res.status(200).send({ status: false, message: err.message });

                let addresses = [];
                for (let index = 0; index < follows.length; index++) {
                    var follow = follows[index];
                    addresses.push(follow.from);
                }
                let users = await User.find({ address: { $in: addresses } }).lean();
                for (let index = 0; index < follows.length; index++) {
                    var follow = follows[index];
                    if (users.filter(user => user.address === follow.from).length == 0) {
                        // add new user
                        let ensName = ""
                        if (isAddress(follow.from)) {
                            const provider = new ethers.providers.JsonRpcProvider(config.mainnet_public_rpc_node);
                            ensName = await provider.lookupAddress(req.params.address.toLowerCase())
                        }
                        let newUser = {
                            address: follow.from,
                            ensName: ensName || "",
                            name: "NoName",
                            originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                            nonce: Math.floor(Math.random() * 1000000)
                        };
                        users.push(newUser);
                    }
                }

                Follow.countDocuments({ from: address }, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ users: users, count: count });
                });
            });

    },

    getFollowing: async function (req, res, next) {
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = req.query.limit && parseInt(req.query.limit) ? parseInt(req.query.limit) : 12;
        let skip = (page - 1) * limit;

        if (!req.query.address) return res.status(200).send({ status: false, message: "No address" })
        let address = req.query.address.toLowerCase();

        Follow.find({ from: address }, { __v: 0, _id: 0 })
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip)
            .lean()
            .exec(async function (err, follows) {
                if (err) return res.status(200).send({ status: false, message: err.message });

                let addresses = [];
                for (let index = 0; index < follows.length; index++) {
                    var follow = follows[index];
                    addresses.push(follow.to);
                }
                let users = await User.find({ address: { $in: addresses } }).lean();

                for (let i = 0; i < follows.length; i++) {
                    let follow = follows[i];

                    if (users.filter(user => user.address === follow.to).length == 0) {
                        // add new user
                        let ensName = ""
                        if (isAddress(follow.to)) {
                            const provider = new ethers.providers.JsonRpcProvider(config.mainnet_public_rpc_node);
                            ensName = await provider.lookupAddress(req.params.address.toLowerCase())
                        }
                        let newUser = {
                            address: follow.to,
                            ensName: ensName || "",
                            name: "NoName",
                            originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                            nonce: Math.floor(Math.random() * 1000000)
                        };
                        users.push(newUser);
                    }
                }

                Follow.countDocuments({ from: address }, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ users: users, count: count });
                });
            });

    },

    getChatUsers: async function (req, res, next) {
        if (!req.query.addresses) return res.status(400).send({ status: false, message: "No params" })
        try {
            let users = await User.find({ address: { $in: req.query.addresses.map((_address) => _address.toLowerCase()) } },
                { address:1, name:1, lowLogo: 1, mediumLogo: 1, highLogo: 1, ensName: 1 }).lean();
            res.status(200).send({ status: true, users: users, message: "success" })

        } catch (e) {
            res.status(200).send({ status: false, message: "No Users found" })
        }
    }
});
