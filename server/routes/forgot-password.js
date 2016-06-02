'use strict';
let UserController = require('../controllers/user-controller'),
	UserModel = require('../models/user-model');

module.exports = function(app) {
	app.route('/forgotPassword')
		.get(UserController.renderForgotPasswordPage)
		.post(function(req, res, next) {
			let newUser = new UserController(UserModel),
				registerResult = newUser.resetPassword(req, res, next);

			//res.json(registerResult);
		});
};