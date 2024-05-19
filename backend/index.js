const express = require('express');
const router = express.Router();
const path = require("path");

const multer = require('multer')
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const user_controller = require('./controllers/UserController');
const api_controller = require('./controllers/ApiController');
const collection_controller = require('./controllers/CollectionController');
const bug_controller = require('./controllers/BugController');
const subscribe_controller = require('./controllers/SubscribeController');
const claim_controller = require('./controllers/ClaimController');
const web3_controller = require('./controllers/Web3ServiceController');
const market_controller = require('./controllers/MarketController');

const maxSize = 4 * 1024 * 1024;

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

var uploadUserFile = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_FILE_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `users/${file.fieldname}/${uuidv4()}-${Date.now()}`)
    }
  }),
  limits: { fileSize: maxSize },
}).fields([
  { name: 'originals', maxCount: 1 },
  { name: 'lows', maxCount: 1 },
  { name: 'mediums', maxCount: 1 },
  { name: 'highs', maxCount: 1 },
  { name: 'banners', maxCount: 1 }
]);

var uploadCollectionFile = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_FILE_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `collections/${file.fieldname}/${uuidv4()}-${Date.now()}`)
    }
  }),
  //limits: { fileSize: maxSize },
}).fields([
  { name: 'originals', maxCount: 1 },
  { name: 'lows', maxCount: 1 },
  { name: 'mediums', maxCount: 1 },
  { name: 'highs', maxCount: 1 },
  { name: 'banners', maxCount: 1 }
]);

/**
 *  User Management
 */
router.get("/api/user_info/:address", (req, res, next) => {
  user_controller.get(req, res, next);
});
router.post("/api/user/update", uploadUserFile, (req, res, next) => {
  user_controller.update(req, res, next);
});

router.post("/api/user/follow", (req, res, next) => {
  user_controller.follow(req, res, next)
});
router.get("/api/user/following_status", (req, res, next) => {
  user_controller.followingStatus(req, res, next);
});

router.get("/api/user/get_following", (req, res, next) => {
  user_controller.getFollowing(req, res, next)
});

router.get("/api/user/get_followers", (req, res, next) => {
  user_controller.getFollowers(req, res, next)
});

router.get("/api/chat_users", (req, res, next) => {
  user_controller.getChatUsers(req, res, next)
});

/**
 *  Explore Management
 */

router.get("/api/featured_collections", (req, res, next) => {
  api_controller.getFeaturedCollections(req, res, next);
});

router.get("/api/top_collections", (req, res, next) => {
  api_controller.getTopCollections(req, res, next);
});

router.get("/api/top3_collections", (req, res, next) => {
  api_controller.getTop3Collections(req, res, next);
});

router.get("/api/top_nfts", (req, res, next) => {
  api_controller.getTopNFTs(req, res, next);
});

router.get("/api/recently_sold", (req, res, next) => {
  api_controller.getRecentlySold(req, res, next);
});

// hex toys page
router.get("/api/exclusive_items", (req, res, next) => {
  api_controller.getExclusiveItems(req, res, next);
});


router.get("/api/items", (req, res, next) => {
  api_controller.getItems(req, res, next);
});

router.get("/api/trading_history", (req, res, next) => {
  api_controller.getTradingHistory(req, res, next);
});

router.get("/api/overview", (req, res, next) => {
  api_controller.getOverview(req, res, next)
});


/**
 *  Search Management
 */
router.get("/api/search_collections", (req, res, next) => {
  api_controller.searchCollections(req, res, next);
});
router.get("/api/search_items", (req, res, next) => {
  api_controller.searchItems(req, res, next);
});
router.get("/api/search_users", (req, res, next) => {
  api_controller.searchUsers(req, res, next);
});
router.get("/api/activities", (req, res, next) => {
  api_controller.getActivities(req, res, next);
});


/**
 *  Item Management
 */
router.get("/api/item_detail/:collection/:tokenId", async (req, res, next) => {
  api_controller.detail(req, res, next);
});
router.get("/api/bids", async (req, res, next) => {
  api_controller.getBids(req, res, next);
});
router.get("/api/pairs", async (req, res, next) => {
  api_controller.getPairs(req, res, next);
});

router.post("/api/item/like", async (req, res, next) => {
  api_controller.like(req, res, next);
});
router.get("/api/categories", async (req, res, next) => {
  api_controller.categories(req, res, next);
});


/**
 *  Leaderboard Management
 */
router.get("/api/leaderboard", async (req, res, next) => {
  api_controller.getLeaderboard(req, res, next);
});



/**
 *  MysteryBox Management
 */
router.get("/api/mysteryboxes", (req, res, next) => {
  api_controller.getMysteryBoxes(req, res, next);
});
router.get("/api/mysterybox/detail", async (req, res, next) => {
  api_controller.getMysteryBoxDetail(req, res, next);
});
router.get("/api/cards", (req, res, next) => {
  api_controller.getCards(req, res, next);
});
router.get("/api/card/detail", (req, res, next) => {
  api_controller.getCardDetail(req, res, next);
});


/**
 *  Staking Management
 */
router.get("/api/stakings", async (req, res, next) => {
  api_controller.getStakings(req, res, next);
});
router.get("/api/staking/detail", async (req, res, next) => {
  api_controller.stakingDetail(req, res, next);
});


router.get("/api/articles", async (req, res, next) => {
  api_controller.getArticles(req, res, next);
});


/**
 *  Collection Management
 */

router.get("/api/new_collection", async (req, res, next) => {
  collection_controller.newCollection(req, res, next);
});

router.get("/api/collection", async (req, res, next) => {
  collection_controller.get(req, res, next);
});

router.get("/api/top_selling_collection", async (req, res, next) => {
  collection_controller.topSellingCollection(req, res, next);
});

router.get("/api/collection/exist", async (req, res, next) => {
  collection_controller.isExist(req, res, next);
});
router.get("/api/collection/detail", async (req, res, next) => {
  collection_controller.detail(req, res, next);
});
router.post("/api/collection/update", uploadCollectionFile, (req, res, next) => {
  collection_controller.update(req, res, next);
});
router.post("/api/collection_asset/upload", uploadCollectionFile, (req, res, next) => {
  collection_controller.upload_collection_asset(req, res, next);
});



/**
 *  Marketplace Management
 */
router.get("/api/signature", (req, res, next) => {
  web3_controller.generateSignature(req, res, next);
});

router.post("/api/market/create_auction", (req, res, next) => {
  market_controller.createAuction(req, res, next);
});
router.post("/api/market/bid_on_auction", (req, res, next) => {
  market_controller.bidOnAuction(req, res, next);
});
router.post("/api/market/cancel_auction", (req, res, next) => {
  market_controller.cancelAuction(req, res, next);
});

router.post("/api/market/create_pair", (req, res, next) => {
  market_controller.createPair(req, res, next);
});
router.post("/api/market/delist_pair", (req, res, next) => {
  market_controller.delistPair(req, res, next);
});

/**
 * Subscribe Management
 */
router.post("/api/collection/request_verify", async (req, res, next) => {
  subscribe_controller.requestVerify(req, res, next);
})
router.post("/api/collection/report_scam", async (req, res, next) => {
  subscribe_controller.reportScam(req, res, next);
})

/**
 * Claim Management
 */
router.post("/api/item/request_claim", async (req, res, next) => {
  claim_controller.requestClaim(req, res, next);
})

/**
 *  Bug Management
 */
router.post("/api/bug", async (req, res, next) => {
  bug_controller.post(req, res, next);
});

module.exports = router;
