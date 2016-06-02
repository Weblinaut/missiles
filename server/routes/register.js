'use strict';
let UserController = require('../controllers/user-controller'),
	UserModel = require('../models/user-model');

module.exports = function(app) {
	app.route('/register')
		.get(UserController.renderRegisterUserPage)
		.post(function(req, res, next) {
			//Since hash password requires async, and callback, get hash pwd, then call register function
			let passwordSalt = require('node-uuid').v4(),
				newUser = new UserController(UserModel);

				/*newUser.hashPassword(req.body.regLoginPassword, passwordSalt, function(err, hashedPwd) {
					console.log(err);
					console.log(hashedPwd);
*/
					newUser.registerUser(req, res, next);
//				});


			//res.json(registerResult);
		});
};