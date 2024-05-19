const _ = require("underscore");
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const UserModel = require('../models/user.model');
const AdminModel = require('../models/admin.model');


module.exports = {
	name: "BaseController",

	extend: function (child) {
		return _.extend({}, this, child);
	},

	authenticateAdmin: function (req, res, next) {
		// Gather the jwt access token from the request header
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]
		if (token == null) return res.sendStatus(401) // if there isn't any token

		jwt.verify(token, config.secret, (err, payload) => {
			if (err) {
				return res.sendStatus(403)
			}

			let email = payload.email;
			let account = payload.account;

			if (email) {
				AdminModel.findOne({ email: email })
					.then(user => {
						if (!user) return res.sendStatus(405);

						req.admin = user
						next();
						return;
					});
			} else if (account) {
				for (let i = 0; i < config.adminAddresses.length; i++) {
					if (config.adminAddresses[i].toLowerCase() === account.toLowerCase()) {
						req.adminAddress = account;
						next();
						return;
					}
				}
				return res.sendStatus(405);
			} else {
				return res.sendStatus(405);
			}
		})
	},
}