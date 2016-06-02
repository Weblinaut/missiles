'use strict';
let UserController = require('../controllers/user-controller'),
	UserModel = require('../models/user-model');

module.exports = function(app) {
	app.route('/')
		.get(UserController.renderLoginPage)
		.post(UserController.renderLoginPage);
		/*function(req, res, next) {
			let user = new UserController(UserModel),
				registerResult = user.login(req, res, next);

			UserController.login
		});*/

	app.route('/login')
		.get(UserController.renderLoginPage)
		.post(function(req, res, next) {
			//Since hash password requires async, and callback, get hash pwd, then call register function
			let user = new UserController(UserModel);
			user.login(req, res, next);
		});
};