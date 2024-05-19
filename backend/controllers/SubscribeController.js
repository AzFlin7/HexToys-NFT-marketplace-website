const BaseController = require("./BaseController");
const ItemCollection = require("../models/collection.model");
const Report = require("../models/report.model");
const { verifyMessage, arrayify, hashMessage } = require("ethers/lib/utils");

module.exports = BaseController.extend({
    name: "SubscribeController",

    requestVerify: async function (req, res, next) {
        try {
            const recoverWallet = verifyMessage(arrayify(hashMessage(req.body.account.toLowerCase() + "-" + req.body.timestamp)), req.body.message);
            if (recoverWallet.toLowerCase() != req.body.account.toLowerCase()) {
                console.log("Invalid Signature");
                return res.status(200).send({ status: false, message: 'Invalid Signature' });
            }
            const itemCollection = await ItemCollection.findOne({ address: req.body.itemCollection.toLowerCase(), ownerAddress: req.body.owner.toLowerCase() })
            if (itemCollection) {
                itemCollection.reviewStatus = 1;
                await itemCollection.save();
                return res.status(200).send({ status: true, message: "Success", collection: itemCollection })
            }
            return res.status(200).send({ status: false, message: "You are not owner of the collection." })
        } catch (e) {
            console.log(e)
            res.status(200).send({ status: false, message: e.message })
        }
    },

    reportScam: async function (req, res, next) {
        try {
            const recoverWallet = verifyMessage(arrayify(hashMessage(req.body.from.toLowerCase() + "-" + req.body.content + "-" + req.body.timestamp)), req.body.message);
            if (recoverWallet.toLowerCase() != req.body.from.toLowerCase()) {
                console.log("Invalid Signature");
                return res.status(200).send({ status: false, message: 'Invalid Signature' });
            }
            const collection = await ItemCollection.findOne({ address: req.body.itemCollection.toLowerCase()})
            if (!collection) return res.status(200).send({ status: false, message : "The collection is not existed."})
            if (collection.ownerAddress.toLowerCase() !== req.body.from.toLowerCase()) {
                const report = new Report({
                    id: Date.now(),
                    timestamp: Math.floor(Date.now() / 1000),
                    itemCollection: collection.address,
                    from: req.body.from,
                    description: req.body.content,
                    isResolved: false,
                })
                await report.save();
                return res.status(200).send({ status: true, message : "Success", report: report})
            }
            return res.status(200).send({ status: false, message: "You can not report about your own collection." })
        } catch (e) {
            console.log(e)
            res.status(200).send({ status: false, message: e.message })
        }
    },

});

