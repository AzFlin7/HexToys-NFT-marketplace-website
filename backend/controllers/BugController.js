const mongoose = require('mongoose');
const BaseController = require('./BaseController');

module.exports = BaseController.extend({
  name: 'BugController',

  post: async function(req, res, next){
    if (!req.body.bugReport) return res.sendStatus(400)
    const bugReport = new BugReport({
      bug: req.body.bugReport,
      version: "testnet-1.0.0"
    })
    bugReport.save()
    res.sendStatus(200)
  }
})

const bugSchema = new mongoose.Schema({
  addressed: {type: Boolean, default: false},
  bug: String,
  version: String
});

const BugReport = mongoose.model('BugReport', bugSchema);
