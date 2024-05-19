var jwt = require('jsonwebtoken');
const ethers = require('ethers');

const config = require('../config')
const BaseController = require('./BaseController');
const Admin = require("../models/admin.model");
const Token = require("../models/token.model");
const Item = require("../models/item.model");
const User = require("../models/user.model");
const Sold = require("../models/sold.model");
const Report = require("../models/report.model");
const Subscribe = require("../models/subscribe.model");
const ItemCollection = require("../models/collection.model");
const Claim = require("../models/claim.model")
const LootBox = require("../models/mysterybox.model");
const { isAddress } = require('ethers/lib/utils');

module.exports = BaseController.extend({
    name: 'AdminController',
    // login apis
    login: async function (req, res, next) {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ error: 'invalid params' })
        }
        try {
            const admin = await Admin.findOne({ email: email });
            if (admin && (password === admin.password)) {

                const token = jwt.sign(
                    {
                        email: admin.email
                    },
                    config.secret,
                    {
                        expiresIn: '43200m', // expireIn 1month
                    }
                );
                return res.send({
                    token,
                    email: admin.email
                });
            } else {
                return res.status(401).send({
                    message: 'Invalid Email or password!',
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: err.message,
            });
        }
    },

    loginFromWallet: async function (req, res, next) {
        let { signData, account, timestamp } = req.body;

        try {
            const recoverWallet = ethers.utils.verifyMessage(ethers.utils.arrayify(ethers.utils.hashMessage(`${account}-${timestamp}`)), signData);
            if (recoverWallet.toLowerCase() != account.toLowerCase()) {
                return res.status(401).send({
                    message: 'Signature is invalid',
                });
            }

            if (Date.now() / 1000 >= parseInt(timestamp) + 300) {
                return res.status(401).send({
                    message: 'Request expired',
                });
            }

            let isAdmin = false;
            for (let i = 0; i < config.adminAddresses.length; i++) {
                if (config.adminAddresses[i].toLowerCase() === account.toLowerCase()) {
                    isAdmin = true;
                    break;
                }
            }

            if (isAdmin === false) {
                return res.status(401).send({
                    message: 'Invalid admin verification',
                });
            }

            const token = jwt.sign(
                {
                    account: account
                },
                config.secret,
                {
                    expiresIn: '43200m', // expireIn 1month
                }
            );
            return res.send({
                token,
                account: account
            });

        } catch (err) {
            return res.status(500).send({
                message: err.message,
            });
        }
    },

    getClaims: async function (req, res, next) {
        var searchQuery = {};
        const limit = req.body.limit ? Math.min(parseInt(req.body.limit), 60) : 36;
        const page = req.body.page && parseInt(req.body.page) ? parseInt(req.body.page) : 1;
        let skip = (page - 1) * limit;

        let sortDir = req.body.sortDir === "asc" || req.body.sortDir === "desc" ? req.body.sortDir : "desc";
        if (sortDir === "asc") {
            sortDir = 1;
        } else if (sortDir === "desc") {
            sortDir = -1;
        }

        sort = { timestamp: sortDir };

        const searchTxt = req.body.searchTxt;
        delete req.body.searchTxt;
        if (searchTxt) {
            searchQuery = { $text: { $search: searchTxt } };
        }
        Claim.find(searchQuery, { __v: 0, _id: 0 })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean()
            .exec(async function (err, claims) {
                if (err) return res.status(200).send({ status: false, message: err.message });
                if (!claims) return res.status(200).send({ status: false, message: "No Claims found" });
                
                let addresses = [];
                for (let index = 0; index < claims.length; index++) {
                    const claim = claim[index];
                    addresses.push(claim.from);
                }
                const users = await User.find({ address: { $in: addresses } });

                let ret = [];
                for (let index = 0; index < claims.length; index++) {
                    let claim = claims[index];
                    let fromUsers = users.filter(user => user.address === claim.from);         
                    
                    if (fromUsers && fromUsers.length > 0) {
                        claim.fromUser = fromUsers[0];
                    } else {
                        let ensName = ""
                        if (isAddress(claim.from)) {
                            const provider = new ethers.providers.JsonRpcProvider(config.mainnet_public_rpc_node);
                            ensName = await provider.lookupAddress(claim.from)
                        }                       
                        claim.fromUser = {
                            address: claim.from,
                            ensName: ensName || "",
                            name: "NoName",
                            originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                            nonce: Math.floor(Math.random() * 1000000)
                        };
                    } 
                    ret.push(claim)
                }

                Claim.countDocuments(searchQuery, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ status: true, claims: ret, count: count });
                });
            });
    },


    // overview api
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
                    }
                }
            }
        ];
        let tradingVolume = 0;
        const tradingVolumeInfos = await Sold.aggregate(totalVolumeQuery);
        if (tradingVolumeInfos && tradingVolumeInfos?.length > 0) {
            tradingVolume = tradingVolumeInfos[0].tradingVolume;
        }

        // get total collection       
        let collectionCount = await ItemCollection.countDocuments({});

        // get total items       
        let itemCount = await Item.countDocuments({});

        // get total users        
        let userCount = await User.countDocuments({});


        res.status(200).send({
            status: true,
            overview: {
                collectionCount: collectionCount,
                itemCount: itemCount,
                userCount: userCount,
                tradingVolume: tradingVolume,
                coinPrice: token.rate
            }
        });
    },


    // lootbox apis
    getLootBoxes: async function (req, res, next) {
        var searchQuery = {};

        const limit = req.body.limit ? Math.min(parseInt(req.body.limit), 60) : 36;
        const page = req.body.page && parseInt(req.body.page) ? parseInt(req.body.page) : 1;
        let skip = (page - 1) * limit;

        let sortDir = req.body.sortDir === "asc" || req.body.sortDir === "desc" ? req.body.sortDir : "desc";
        if (sortDir === "asc") {
            sortDir = 1;
        } else if (sortDir === "desc") {
            sortDir = -1;
        }

        sort = { timestamp: sortDir };

        const searchTxt = req.body.searchTxt;
        delete req.body.searchTxt;
        if (searchTxt) {
            searchQuery = { $text: { $search: searchTxt } };
        }

        LootBox.find(searchQuery, { __v: 0, _id: 0 })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean()
            .exec(async function (err, lootboxes) {
                if (err) return res.status(200).send({ status: false, message: err.message });
                if (!lootboxes) return res.status(200).send({ status: false, message: "No LootBox found" });
                let ret = [];
                let addresses = [];
                for (let index = 0; index < lootboxes.length; index++) {
                    const lootbox = lootboxes[index];
                    addresses.push(lootbox.owner);
                }
                let users = await User.find({ address: { $in: addresses } });

                for (let index = 0; index < lootboxes.length; index++) {
                    let lootbox = lootboxes[index];

                    let ownerUsers = users.filter(user => user.address === lootbox.owner);
                    if (ownerUsers && ownerUsers.length > 0) {
                        lootbox.ownerUser = ownerUsers[0];
                    } else {
                        let ensName = ""
                        if (isAddress(lootbox.owner)) {
                            const provider = new ethers.providers.JsonRpcProvider(config.mainnet_public_rpc_node);
                            ensName = await provider.lookupAddress(lootbox.owner)
                        }  
                        lootbox.ownerUser = {
                            address: lootbox.owner,
                            ensName: ensName || "",
                            name: "NoName",
                            originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
                        };
                    }
                    if (lootbox.visible === undefined) lootbox.visible = true
                    ret.push(lootbox)
                }

                LootBox.countDocuments(req.query, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ status: true, lootboxes: ret, count: count });
                });
            });
    },

    updateLootBox: async function (req, res, next) {
        if (!req.body.address) return res.status(200).send({ status: false, message: "Missing LootBox Address" });
        const { address, visible } = req.body

        const lootbox = await LootBox.findOne({ address: address.toLowerCase() })
        if (lootbox) {
            lootbox.visible = visible;
            await lootbox.save();
            return res.status(200).send({ status: true, lootbox: lootbox });
        } else {
            return res.status(200).send({ status: false, message: "lootbox is not existed" });
        }
    },


    // collection apis
    getCollections: async function (req, res, next) {        
        var searchQuery = {};

        if (req.body.isFeatured) {
            searchQuery.isFeatured = req.body.isFeatured === 'true'
        }
        const limit = req.body.limit ? Math.min(parseInt(req.body.limit), 60) : 36;
        const page = req.body.page && parseInt(req.body.page) ? parseInt(req.body.page) : 1;
        let skip = (page - 1) * limit;

        let sortDir = req.body.sortDir === "asc" || req.body.sortDir === "desc" ? req.body.sortDir : "desc";
        if (sortDir === "asc") {
            sortDir = 1;
        } else if (sortDir === "desc") {
            sortDir = -1;
        }

        sort = { timestamp: sortDir };

        const searchTxt = req.body.searchTxt;
        delete req.body.searchTxt;
        if (searchTxt) {
            searchQuery = {
                $and: [
                    searchQuery,
                    { $text: { $search: searchTxt } }
                ]
            };
        }
        ItemCollection.find(searchQuery, { __v: 0, _id: 0 })
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
                let users = await User.find({ address: { $in: addresses } });

                for (let index = 0; index < collections.length; index++) {
                    let collection = collections[index];
                    let ownerUsers = users.filter(user => user.address === collection.ownerAddress);
                    if (ownerUsers && ownerUsers.length > 0) {
                        collection.ownerUser = ownerUsers[0];
                    } else {
                        let ensName = ""
                        if (isAddress(collection.ownerUser)) {
                            const provider = new ethers.providers.JsonRpcProvider(config.mainnet_public_rpc_node);
                            ensName = await provider.lookupAddress(collection.ownerUser)
                        } 
                        collection.ownerUser = {
                            address: collection.ownerAddress,
                            ensName: ensName || "",
                            name: "NoName",
                            originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"
                        };
                    }
                    let reportCount = await Report.countDocuments({ itemCollection: collection.address });
                    collection.reportsCount = reportCount;

                    if (collection.reviewStatus == 3) {
                        const subscribe = await Subscribe.findOne({ itemCollection: collection.address });
                        if (subscribe?.expireDate > Date.now() / 1000) {
                            collection.reviewStatus == 4;
                        }
                    }

                    ret.push(collection)
                }
                ItemCollection.countDocuments(searchQuery, function (err2, count) {
                    if (err2) return res.status(200).send({ status: false, message: err2.message });
                    res.status(200).send({ status: true, collections: ret, count: count });
                });
            });
    },

    getCollectionDetail: async function (req, res, next) {
        if (!req.body.address) return res.status(200).send({ status: false, message: "missing collection address" });

        const collectionAddress = req.body.address.toLowerCase();

        ItemCollection.findOne({ address: collectionAddress }, { __v: 0, _id: 0 }).lean().exec(
            async (err, collection) => {
                if (err) return res.status(200).send({ status: false, message: err.message });
                if (!collection) return res.status(200).send({ status: false, message: "No collections found" })
                var owner = await User.findOne({ address: collection.ownerAddress }, { _id: 0, __v: 0 }).lean();
                if (!owner) {
                    collection.ownerUser = {
                        address: collection.ownerAddress.toLowerCase(),
                        name: "NoName",
                        originalLogo: "https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        nonce: Math.floor(Math.random() * 1000000)
                    };
                } else {
                    collection.ownerUser = owner;
                }

                // floor price    
                let floorPrice = 0.0;
                if (collection.tradingCount && collection.tradingCount > 0) {
                    floorPrice = collection.tradingVolume / collection.tradingCount;
                }

                let token = await Token.findOne({ address: '0x0000000000000000000000000000000000000000' });

                const summary = {
                    itemCount: collection.totalItemCount || 0,
                    totalVolume: collection.tradingVolume || 0,
                    floorPrice: floorPrice,
                    totalOwners: collection.totalOwners || 0,
                    coinPrice: token.rate
                }

                const reports = await Report.find({ itemCollection: collection.address }).sort({ timestamp: -1 }).limit(100);
                const subscribe = await Subscribe.findOne({ itemCollection: collection.address });

                collection.summary = summary;
                collection.reports = reports;
                collection.subscribe = subscribe;

                res.status(200).send({ status: true, collection: collection })
            });
    },

    updateWhitelist: async function (req, res, next) {
        if (!req.body.address) return res.status(200).send({ status: false, message: "missing collection address" });

        const collectionAddress = req.body.address.toLowerCase();

        const whitelist = req.body.whitelist ? JSON.parse(req.body.whitelist) : [];

        var collectionEntity = await ItemCollection.findOne({ address: collectionAddress });
        if (collectionEntity) {
            const lowers = whitelist.map(address => {
                return address.trim().toLowerCase();
            })
            collectionEntity.whitelist = lowers;

            await collectionEntity.save();

            return res.status(200).send({ status: true, collection: collectionEntity });
        } else {
            return res.status(200).send({ status: false, message: "collection is not existed" });
        }
    },

    confirmVerify: async function (req, res, next) {
        if (!req.body.address) return res.status(200).send({ status: false, message: "Missing Collection Address" });

        const collectionAddress = req.body.address.toLowerCase();

        const collectionEntity = await ItemCollection.findOne({ address: collectionAddress });
        if (collectionEntity) {
            if (collectionEntity.reviewStatus !== 1)
                return res.status(200).send({ status: false, message: "The collection status is not under review." });
            collectionEntity.reviewStatus = 2;

            await collectionEntity.save();

            return res.status(200).send({ status: true, collection: collectionEntity });
        } else {
            return res.status(200).send({ status: false, message: "collection is not existed" });
        }
    },

    setVisible: async function (req, res, next) {
        if (!req.body.address) return res.status(200).send({ status: false, message: "Missing Collection Address" });

        const collectionAddress = req.body.address.toLowerCase();
        const visible = req.body.visible;

        const collectionEntity = await ItemCollection.findOne({ address: collectionAddress });
        if (collectionEntity) {
            collectionEntity.visibility = visible;
            await collectionEntity.save();

            await Item.updateMany({ itemCollection: collectionAddress }, {
                visibility: visible
            });

            return res.status(200).send({ status: true, collection: collectionEntity });
        } else {
            return res.status(200).send({ status: false, message: "collection is not existed" });
        }
    },

    updateCollection: async function (req, res, next) {
        if (!req.body.collection) return res.status(200).send({ status: false, message: "No collection address" })

        const collectionAddress = req.body.collection.toLowerCase();

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

            if (name && name != undefined) collection.name = name
            if (description && description != undefined) collection.description = description

            collection.image = originalLogo
            collection.lowLogo = lowLogo
            collection.mediumLogo = mediumLogo
            collection.highLogo = highLogo
            collection.coverUrl = coverUrl

            if ((website && website != undefined) || website === "") collection.website = website
            if ((telegram && telegram != undefined) || telegram === "") collection.telegram = telegram
            if ((discord && discord != undefined) || discord === "") collection.discord = discord
            if ((twitter && twitter != undefined) || twitter === "") collection.twitter = twitter
            if ((facebook && facebook != undefined) || facebook === "") collection.facebook = facebook
            if ((instagram && instagram != undefined) || instagram === "") collection.instagram = instagram
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

    updateFeaturedCol: async function (req, res, next) {
        if (!req.body.collection) return res.status(200).send({ status: false, message: "No collection address" })

        const collectionAddress = req.body.collection.toLowerCase();

        let bgUrl = ""
        if (req.files["bg"] && req.files["bg"][0]) bgUrl = req.files["bg"][0]?.location
        if (req.body.bgUrl) bgUrl = req.body.bgUrl

        let logoUrl = ""
        let logoType = ""
        if (req.files["logo"] && req.files["logo"][0]) {
            logoUrl = req.files["logo"][0]?.location
            logoType = req.files["logo"][0]?.mimetype.split("/")[0]
        }
        if (req.body.logoUrl) {
            logoUrl = req.body.logoUrl
            logoType = req.body.logoType
        }

        ItemCollection.findOne({ address: collectionAddress }, async (err, collection) => {
            if (err) return res.status(200).send({ status: false, message: err.message });
            if (!collection) return res.status(200).send({ status: false, message: "Collection not found" });
            console.log(collection)
            collection.bgUrl = bgUrl
            collection.logoUrl = logoUrl
            collection.logoType = logoType
            collection.isFeatured = req.body.isFeatured

            await collection.save();
            return res.status(200).send({ status: true, message: 'success', collection: collection });
        })
    },

});
