const BaseController = require("./BaseController");
const Item = require("../models/item.model");
const Claim = require("../models/claim.model");
const ethers = require('ethers');
const Web3 = require("web3");
const config = require("../config");
var ethSignUtil = require('eth-sig-util');
var ethereumjsUtil = require('ethereumjs-util');

module.exports = BaseController.extend({
    name: "ClaimController",

    requestClaim: async function (req, res, next) {
        try {
            let { itemCollection, tokenId, from, amount, delivery, signature } = req.body;
            if (itemCollection.toLowerCase() !== config.HexToysAddress.toLowerCase()) return res.status(200).send({status: false, message:'You can claim for only Hex Toys Default Collection.'})
            // check out signature validation
            const msg = `I want to request the claim with this information: ${itemCollection}:${tokenId}:${from}:${amount}:${delivery}`;
            const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
            const publicAddress = ethSignUtil.recoverPersonalSignature({
                data: msgBufferHex,
                sig: signature,
            });
            if (from.toLowerCase() !== publicAddress.toLowerCase()) {
                console.log("Invalid Signature");
                return res.status(200).send({ status: false, message: 'Invalid Signature' });
            }
            const item = await Item.findOne({ itemCollection: req.body.itemCollection.toLowerCase(), tokenId: req.body.tokenId })
            if (!item) return res.status(200).send({ status: false, message: 'No Such NFT Item' })

            const holder = item.holders.find((_holder) => _holder.address.toLowerCase() === from.toLowerCase() && _holder.balance > 0)
            if (!holder) return res.status(200).send({ status: false, message: 'You are not owner of this nft item' })

            const claim = await Claim.findOne({ itemCollection: item.itemCollection, tokenId: item.tokenId, from: from.toLowerCase() })
            if (holder.balance < (claim ? claim.amount : 0) + parseInt(req.body.amount)) return res.status(200).send({ status: false, message: 'You have no enough amount to claim.' })

            const claimId = Date.now()
            const timestamp = Math.floor(claimId / 1000)

            const hash = this.hashMessage(claimId, item.itemCollection, item.tokenId, from, parseInt(amount), timestamp)
            const _signature = this.signMessage(hash);

            const newClaim = new Claim({
                id: claimId,
                timestamp: timestamp,
                itemCollection: item.itemCollection,
                tokenId: item.tokenId,
                type: item.type,
                from: from.toLowerCase(),
                amount: amount,
                delivery: delivery,
                status: 0,
                signature: _signature,
            })
            await newClaim.save();

            return res.status(200).send({ status: true, message: "Requested Successfully" })
        } catch (e) {
            console.log(e)
            return res.status(200).send({ status: false, message: e.message })
        }
    },

    hashMessage: function (claimId, itemCollection, tokenId, from, amount, timestamp) {
        const hash = ethers.utils.solidityKeccak256(
            ["uint256", "address", "uint256", "address", "uint256", "uint256"],
            [claimId, itemCollection, tokenId, from, amount, timestamp]);
        return hash;
    },

    signMessage: function (hash) {
        const web3 = new Web3(
            new Web3.providers.HttpProvider(process.env.APP_RPC)
        );
        const signature = web3.eth.accounts.sign(hash, process.env.SIGNER_PRIVATE_KEY);
        return signature.signature;
    }

});

