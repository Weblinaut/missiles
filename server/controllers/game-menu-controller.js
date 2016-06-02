'use strict';

require('../models/user-model');

let pageVars = require('../models/page-vars');//used in static methods

class GameMenuController {
	//constructor(email, password, regLoginConfirmPassword, alias, firstName, lastName, lastLogin) {
	constructor(UserModel, session, mailer) {
		//Libraries


		//
		this.db = require('../../config/config');
		this.ApiResponse = require('../models/api-response');
		this.ApiMessages = require('../models/api-messages');
	}

	///////////////////////
	// Routing/Rendering
	///////////////////////
	/**
	 * Render Login page view
	 * @param req
	 * @param res
	 * @param next
	 */
	static renderGameMenuPage(req, res, next) {
		//TODO Always check session before render pages '/in'
		if (!req.user) {
			res.render(pageVars.gameMenuVars.body, pageVars.gameMenuVars);
		}
		else {
			return res.redirect('/');
		}
	}
}

module.exports = GameMenuController;