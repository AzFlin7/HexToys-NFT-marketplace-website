const abi = require('ethereumjs-abi');
const Web3 = require("web3");
const ethers = require('ethers');
const fs = require('fs');
const config = require('../config');

const BaseController = require('./BaseController');
const Pair = require("../models/pair.model");
const Auction = require("../models/auction.model");
const Token = require('../models/token.model');
const Bid = require("../models/bid.model");
const ItemCollection = require("../models/collection.model");
const { arrayify } = require('ethers/lib/utils');

const getContractABI = (name) => {
    return JSON.parse(fs.readFileSync(`./abis/${name}.json`));
}
const provider = new ethers.providers.JsonRpcProvider(process.env.APP_RPC);

module.exports = BaseController.extend({
    name: 'Web3ServiceController',

    generateSignature: async function (req, res, next) {
        if (!req.query.account || !req.query.amount || !req.query.productId || !req.query.type) {
            return res.status(200).send({ status: false, message: "Missing params" });
        }
        if (Number(req.query.amount) <= 0) {
            return res.status(200).send({ status: false, message: "invalid amount" });
        }
       
        let account = req.query.account.toLowerCase();

        // get nonce from market contract.
        var nftContract = new ethers.Contract(config.marketplaceV2, getContractABI('MarketV2'), provider);
        const nonce = await nftContract.nonce(account);          

        if (req.query.type === 'auction') {
            let auction = await Auction.findOne({ auctionId: Number(req.query.productId) });
            if (!auction) {
                return res.status(200).send({ status: false, message: "invalid productId" });
            }
            if (account !== auction.owner) {
                return res.status(200).send({ status: false, message: "invalid account" });
            }
            let bids = await Bid.find({ auctionId: auction.auctionId }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).limit(10).lean();
            if (bids.length === 0) {
                return res.status(200).send({ status: false, message: "no bidder" });
            }

            let collection = await ItemCollection.findOne({ address: auction.itemCollection });
            let royalties = collection.royalties || [];
            var token = await Token.findOne({ address: bids[0].tokenAdr });    

            const hash = this.hashMessage(
                auction.itemCollection,
                auction.tokenId,
                Number(req.query.productId),
                1,
                ethers.utils.parseUnits(String(bids[0].bidPrice), token.decimal),
                bids[0].tokenAdr,
                bids[0].from,
                auction.owner,
                Number(nonce),
                royalties
            );
            const signature = this.signMessage(hash);
            return res.status(200).send({ status: true, message: 'Success', signature: signature });

        } else if (req.query.type === 'pair') {
            let pair = await Pair.findOne({ pairId: Number(req.query.productId) });
            if (!pair) {
                return res.status(200).send({ status: false, message: "invalid productId" });
            }
            let collection = await ItemCollection.findOne({ address: pair.itemCollection });
            let royalties = collection.royalties || [];
            var token = await Token.findOne({ address: pair.tokenAdr });           

            const hash = this.hashMessage(
                pair.itemCollection,
                pair.tokenId,
                Number(req.query.productId),
                Number(req.query.amount),
                ethers.utils.parseUnits(String(pair.price), token.decimal),
                pair.tokenAdr,
                account,
                pair.owner,
                Number(nonce),
                royalties
            );
            const signature = this.signMessage(hash);
            return res.status(200).send({ status: true, message: 'Success', signature: signature });

        } else {
            return res.status(200).send({ status: false, message: "invalid type" });
        }
    },

    hashMessage: function (collection, tokenId, productId, amount, price, tokenAddr, buyer, seller, nonce, royalties) {
        
        let percentage = [];
        let addresses = [];
        for (let index = 0; index < royalties.length; index++) {
            const royalty = royalties[index];
            percentage.push(Math.floor(Number(royalty.percentage)*10));
            addresses.push(royalty.address);                           
        }        

        const hash = ethers.utils.solidityKeccak256(
            ["address", "uint256", "uint256", "uint256", "uint256", "address", "address", "address", "uint256", "uint256[]", "address[]"], 
            [collection, tokenId, productId, amount, price, tokenAddr, buyer, seller, nonce, percentage, addresses]);
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
