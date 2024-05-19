
const BaseController = require('./BaseController');
const ethers = require('ethers');
var ethSignUtil = require('eth-sig-util');
var ethereumjsUtil = require('ethereumjs-util');
const ItemCollection = require("../models/collection.model");
const Item = require("../models/item.model");
const Sold = require("../models/sold.model");
const Token = require("../models/token.model");

const User = require("../models/user.model");
const { isAddress } = require('ethers/lib/utils');
const config = require('../config');

module.exports = BaseController.extend({
    name: 'CollectionController',

    get: async function (req, res, next) {

        // it is for create page
        const ownerAddress = req.query.ownerAddress
        delete req.query.ownerAddress
        if (ownerAddress) {
            req.query['$or'] = [{ ownerAddress: ownerAddress.toLowerCase(), isImported: false }, { isPublic: true }];
        }

        // it is for get owned collections
        const owner = req.query.owner;
        delete req.query.owner;
        if (owner) {
            req.query.ownerAddress = owner.toLowerCase();            
        }

        let limit = req.query.limit ? Math.min(parseInt(req.query.limit), 60) : 36;
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * limit;

        let sortDir =
            req.query.sortDir === "asc" || req.query.sortDir === "desc"
                ? req.query.sortDir
                : "desc";
        if (sortDir === "asc") sortDir = 1;
        else if (sortDir === "desc") sortDir = -1;

        sort = { timestamp: sortDir };

        delete req.query.page;
        delete req.query.limit;
        delete req.query.sortDir;

        const searchTxt = req.query.searchTxt;
        delete req.query.searchTxt;
        req.query.isSynced = true;
        req.query.visibility = true;
        if (searchTxt) {           
            req.query = {
                $and: [
                    req.query,
                    { $text: { $search: searchTxt } }
                ]
            };
        }

        ItemCollection.find(req.query, { __v: 0, _id: 0 })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean()
            .exec(async function (err, collections) {
                if (err) return res.status(200).send({ status: false, message: err.message });
                if (!collections) return res.status(200).send({ status: false, message: "No collections found" });
                let ret = [];

                let addresses = [];
                for (let index = 0; index < collections.length; index++) {
                    const collection = collections[index];
                    addresses.push(collection.ownerAddress);
                }
                const users = await User.find({ address: { $in: addresses } });

                for (let index = 0; index < collections.length; index++) {
                    let collection = collections[index];
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

                ItemCollection.countDocuments(req.query, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ status: true, collections: ret, count: count });
                });
            });
    },

    newCollection: async function (req, res, next) {
        sort = { timestamp: -1 };
        ItemCollection.find({
            isSynced: true,
            visibility: true
        }, { __v: 0, _id: 0 })
            .sort(sort)
            .limit(10)
            .lean()
            .exec(async function (err, collections) {
                if (err) return res.status(200).send({ status: false, message: err.message });
                if (!collections) return res.status(200).send({ status: false, message: "No collections found" });
                let ret = [];

                let addresses = [];
                for (let index = 0; index < collections.length; index++) {
                    const collection = collections[index];
                    addresses.push(collection.ownerAddress);
                }
                const users = await User.find({ address: { $in: addresses } });

                for (let index = 0; index < collections.length; index++) {
                    let collection = collections[index];
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

                ItemCollection.countDocuments({}, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ status: true, collections: ret, count: count });
                });
            });
    },

    topSellingCollection: async function (req, res, next) {
        sort = { tradingVolume: -1 };
        ItemCollection.find({}, { __v: 0, _id: 0 })
            .sort(sort)
            .limit(10)
            .lean()
            .exec(async function (err, collections) {
                if (err) return res.status(200).send({ status: false, message: err.message });
                if (!collections) return res.status(200).send({ status: false, message: "No collections found" });
                let ret = [];

                let addresses = [];
                for (let index = 0; index < collections.length; index++) {
                    const collection = collections[index];
                    addresses.push(collection.ownerAddress);
                }
                const users = await User.find({ address: { $in: addresses } });

                for (let index = 0; index < collections.length; index++) {
                    let collection = collections[index];
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

                ItemCollection.countDocuments({}, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ status: true, collections: ret, count: count });
                });
            });
    },

    isExist: async function (req, res, next) {
        ItemCollection.find(req.query, async (err, collections) => {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collections || collections.length == 0) return res.status(200).send({ status: false, message: "No collections found" })

            res.status(200).send({ status: true, collections: collections })
        })
    },

    detail: async function (req, res, next) {
        if (req.query.address) {
            req.query.address = req.query.address.toLowerCase();
        }
        ItemCollection.findOne(req.query,
            { __v: 0, _id: 0 }
        ).lean().exec(async (err, collection) => {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collection) return res.status(200).send({ status: false, message: "No collections found" })
            var owner = await User.findOne({ address: collection.ownerAddress }, { _id: 0, __v: 0 }).lean();
            if (!owner) {
                let ensName = ""
                if (isAddress(req.query.address.toLowerCase())) {
                    const provider = new ethers.providers.JsonRpcProvider(config.mainnet_public_rpc_node);
                    ensName = await provider.lookupAddress(req.query.address.toLowerCase())
                }
                const newUser = new User({
                    address: collection.ownerAddress.toLowerCase(),
                    ensName: ensName || "",
                    name: "NoName",
                    originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                    nonce: Math.floor(Math.random() * 1000000)
                })
                collection.ownerUser = newUser;
            } else {
                collection.ownerUser = owner;
            }

            // highest sale
            const soldQuery = [
                {
                    $match: {
                        'itemCollection': collection.ownerAddress
                    }
                },
                {
                    $group: {
                        _id: '$itemCollection',
                        highestSale: {
                            $max: '$usdPrice'
                        },
                    }
                }
            ];
            const soldResult = await Sold.aggregate(soldQuery);
            let highestSale = 0.0;
            if (soldResult && soldResult?.length > 0) {
                highestSale = soldResult[0].highestSale;
            }
            collection.highestSale = highestSale;

            res.status(200).send({ status: true, collection: collection })
        });
    },

    update: async function (req, res, next) {
        if (!req.body.account) return res.status(200).send({ status: false, message: "No account address" })
        if (!req.body.collection) return res.status(200).send({ status: false, message: "No collection address" })
        if (!req.body.signature) return res.status(200).send({ status: false, message: "No signature" })

        const accountAddress = req.body.account.toLowerCase();
        const collectionAddress = req.body.collection.toLowerCase();

        // check out signature validation
        const msg = `I want to update collection :${accountAddress}:${collectionAddress}`;
        const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const publicAddress = ethSignUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: req.body.signature,
        });

        if (publicAddress.toLowerCase() !== accountAddress) {
            return res.status(200).send({ status: false, message: 'invalid signature' });
        }

        const website = req.body.website || ""
        const telegram = req.body.telegram || ""
        const discord = req.body.discord || ""
        const twitter = req.body.twitter || ""
        const facebook = req.body.facebook || ""
        const instagram = req.body.instagram || ""

        const name = req.body.name || ""
        const description = req.body.description || ""

        let originalLogo = ""
        if (req.files["originals"] && req.files["originals"][0]) originalLogo = req.files["originals"][0]?.location
        if (req.body.image) originalLogo = req.body.image

        let lowLogo = ""
        if (req.files["lows"] && req.files["lows"][0]) lowLogo = req.files["lows"][0]?.location
        if (req.body.lowLogo) lowLogo = req.body.lowLogo

        let mediumLogo = ""
        if (req.files["mediums"] && req.files["mediums"][0]) mediumLogo = req.files["mediums"][0]?.location
        if (req.body.mediumLogo) mediumLogo = req.body.mediumLogo

        let highLogo = ""
        if (req.files["highs"] && req.files["highs"][0]) highLogo = req.files["highs"][0]?.location
        if (req.body.highLogo) highLogo = req.body.highLogo

        let coverUrl = ""
        if (req.files["banners"] && req.files["banners"][0]) coverUrl = req.files["banners"][0]?.location
        if (req.body.coverUrl) coverUrl = req.body.coverUrl

        const image = req.body.image || "https://ipfs.hex.toys/ipfs/QmPF4ybwpu7dXqu4spWEZRQVBTn18TXgy95TzBGpbUvSmC"
        const coverImg = req.body.coverImg || "https://ipfs.hex.toys/ipfs/QmXooxFVZcDmMPkj3wPvJ9P67id2atVHgNGRN8mzt5Ytht"
        var royalties = req.body.royalties ? JSON.parse(req.body.royalties) : [];
        royalties = royalties.map(royalty => {
            return {
                address: royalty.address.trim().toLowerCase(),
                percentage: Number(royalty.percentage)
            };
        })

        if (royalties && royalties.length > 0) {
            for (let index = 0; index < royalties.length; index++) {
                const roaylty = royalties[index];
                try {
                    ethers.utils.getAddress(roaylty.address);
                } catch (e) {
                    return res.status(200).send({ status: false, message: "invalid royalty address" });
                }
                if ((Number(roaylty.percentage) > 100) || Number(roaylty.percentage) <= 0) {
                    return res.status(200).send({ status: false, message: "invalid royalty percentage" });
                }
            }
        }

        ItemCollection.findOne({ address: collectionAddress }, async (err, collection) => {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collection) return res.status(200).send({ status: false, message: "Collection not found" });
            const whitelist = collection.whitelist || [];

            if ((collection.ownerAddress !== accountAddress) && (!whitelist.includes(accountAddress))) {
                return res.status(200).send({ status: false, message: "only owner or white list user can update collection" });
            }

            if (name && name != undefined || name === "") collection.name = name
            if (description && description != undefined || description === "") collection.description = description
            // if (image && image != undefined || image === "https://ipfs.hex.toys/ipfs/QmPF4ybwpu7dXqu4spWEZRQVBTn18TXgy95TzBGpbUvSmC") collection.image = image
            // if (coverImg && coverImg != undefined || coverImg === "https://ipfs.hex.toys/ipfs/QmXooxFVZcDmMPkj3wPvJ9P67id2atVHgNGRN8mzt5Ytht") collection.coverImg = coverImg

            collection.image = originalLogo
            collection.lowLogo = lowLogo
            collection.mediumLogo = mediumLogo
            collection.highLogo = highLogo
            collection.coverUrl = coverUrl

            if (website && website != undefined || website === "") collection.website = website
            if (telegram && telegram != undefined || telegram === "") collection.telegram = telegram
            if (discord && discord != undefined || discord === "") collection.discord = discord
            if (twitter && twitter != undefined || twitter === "") collection.twitter = twitter
            if (facebook && facebook != undefined || facebook === "") collection.facebook = facebook
            if (instagram && instagram != undefined || instagram === "") collection.instagram = instagram
            if ((royalties && royalties.length > 0) || royalties === []) collection.royalties = royalties

            await collection.save();
            return res.status(200).send({ status: true, message: 'success' });
        })
    },

    upload_collection_asset: async function (req, res, next) {
        let originalLogo = ""
        if (req.files["originals"] && req.files["originals"][0]) originalLogo = req.files["originals"][0]?.location

        let lowLogo = ""
        if (req.files["lows"] && req.files["lows"][0]) lowLogo = req.files["lows"][0]?.location

        let mediumLogo = ""
        if (req.files["mediums"] && req.files["mediums"][0]) mediumLogo = req.files["mediums"][0]?.location

        let highLogo = ""
        if (req.files["highs"] && req.files["highs"][0]) highLogo = req.files["highs"][0]?.location

        let coverUrl = ""
        if (req.files["banners"] && req.files["banners"][0]) coverUrl = req.files["banners"][0]?.location

        return res.status(200).send({ original: originalLogo, lowLogo: lowLogo, mediumLogo: mediumLogo, highLogo: highLogo, coverUrl: coverUrl })
    },
});
