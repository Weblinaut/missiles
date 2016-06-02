'use strict';

require('../models/user-model');

let pageVars = require('../models/page-vars');//used in static methods

let mailer = require('../../config/mailer'),
	GameMenuController = require('./game-menu-controller'),
	MailerController = require('./mailer-controller');

class UserController {
	//constructor(email, password, regLoginConfirmPassword, alias, firstName, lastName, lastLogin) {
	constructor(UserModel, session, mailer) {
		//Libraries
		//this.passwordHash = require('password-hash');
		//this.crypto = require('crypto');
		//this.uuid = require('node-uuid');
		this.bcrypt = require('bcrypt-nodejs');
		this.passport = require('passport');
		//
		this.db = require('../../config/config');
		this.ApiResponse = require('../models/api-response');
		this.ApiMessages = require('../models/api-messages');
		this.UserProfileModel = require('../models/user-profile-model');

		this.UserModel = UserModel;
		/*this.userModel = userModel;
		this.session = session;
		this.mailer = mailer;*/

		//Constants (const not working)
		//this.cryptoIterations = 10000;
		//this.cryptoKeyLen = 64; // Must match keyLen used in controller#hashPassword.
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
	static renderLoginPage (req, res, next) {
		//TODO REMOVE, just testing here
		req.mailType = 'forgotPassword';
		//MailerController.sendMail(req, res, next);

		if(typeof res.apiResponse !== 'undefined' && !res.apiResponse.success) {
			pageVars.loginPageVars.errorMsg = res.apiResponse.error.errorMsg;
		}

		res.render(pageVars.loginPageVars.body, pageVars.loginPageVars);
	}

	static renderRegisterUserPage (req, res, next) {
		if (!req.user) {
			//If register wasn't successful, throw error
			if(typeof res.apiResponse !== 'undefined' && !res.apiResponse.success) {
				pageVars.registerPageVars.errorMsg = res.apiResponse.error.errorMsg;
			}
			//If successful, go to main game menu page
			res.render(pageVars.registerPageVars.body, pageVars.registerPageVars);
		}
		else {
			//If successful, go to main game menu page

			//res.render(pageVars.gameMenuVars.body, pageVars.gameMenuVars);
			return res.redirect('/gameMenu');
		}
	}

	static renderForgotPasswordPage (req, res, next) {
		if (!req.user) {
			res.render(pageVars.forgotPasswordPageVars.body, pageVars.forgotPasswordPageVars);
		}
		else {
			return res.redirect('/');
		}
	}

	///////////////////////
	// User Class methods
	///////////////////////
	registerUser (req, res, next) {
		//If valid pwd, create User object and register
		let uc = this,
			validatePasswordResult = UserController.validatePassword(req.body.regLoginPassword, req.body.regLoginConfirmPassword);

		if (validatePasswordResult.success) {

			let passwordSalt = uc.getHashSalt(),
				userObj = {
					email: req.body.regLoginEmail,
					password: this.hashPassword(req.body.regLoginPassword, passwordSalt),
					passwordSalt: passwordSalt,
					alias: req.body.regAlias,
					firstName: req.body.regFirstName,
					lastName: req.body.regLastName,
					lastLogin: new Date().getTime()
				},
				//Create model with given registration info
				user = new uc.UserModel(userObj);

			//Check if email exists in db
			uc.UserModel.findOne({email: user.email}, function (err, userEntry) {
				if (err) {
					res.apiResponse = new uc.ApiResponse({
						success: false,
						error: uc.ApiMessages.DB_ERROR
					});

					return UserController.renderRegisterUserPage(req, res, next);
				}
				//If email exists in DB, it is already registered
				else if (userEntry) {
					res.apiResponse = new uc.ApiResponse({
						success: false,
						error: uc.ApiMessages.EMAIL_ALREADY_EXISTS
					});

					return UserController.renderRegisterUserPage(req, res, next)
				}
				//If not attempt to save email
				else {
					user.save(function (err, user, numberAffected) {
						if (err) {
							res.apiResponse = new uc.ApiResponse({
								success: false,
								error: uc.ApiMessages.DB_ERROR
							});
						}

						//If insert was success, create user profile model and send back to caller
						if (numberAffected === 1) {
							res.apiResponse = new uc.ApiResponse({
								success: true
							});

							//If successful register, go to login page, else stay register page and display error from response
							//NOTE: Async, has to be in here, else for invalid has to be separate below
							return UserController.renderLoginPage(req, res, next);
						}
						//Generic fail error (info was bad, json corrupt, etc)
						else {
							res.apiResponse = new uc.ApiResponse({
								success: false,
								error: uc.ApiMessages.COULD_NOT_CREATE_USER
							});

							return UserController.renderRegisterUserPage(req, res, next);
						}
					});
				}
			});
		}
		//Password confirm doesn't match or isn't valid
		else {
			res.apiResponse = new uc.ApiResponse({
				success: false,
				error: uc.ApiMessages.NEW_PASSWORDS_MISMATCH
			});

			return UserController.renderRegisterUserPage(req, res, next);
		}
	}

	hashPassword (password, salt, callback) {
		//use pbkdf2 to hash and iterate 10k times by default
		//return this.crypto.pbkdf2(password, salt, this.cryptoIterations, this.cryptoKeyLen, callback);
		return this.bcrypt.hashSync(password, salt);
	}

	getHashSalt(iterations) {
		console.log(iterations);
		return this.bcrypt.genSaltSync(iterations || 100);
	}

	checkHash (password, hash) {
		return this.bcrypt.compareSync(password, hash); // true
		//bcrypt.compareSync('not_bacon', hash); // false

	}

	getUserFromUserRegistration (userRegistrationModel) {
		var uc = this;

		if (userRegistrationModel.password !== userRegistrationModel.passwordConfirm) {
			return new uc.ApiResponse({ success: false, extras: { msg: uc.ApiMessages.PASSWORD_CONFIRM_MISMATCH } });
		}

		var passwordSaltIn = this.getHashSalt(),//this.uuid.v4(),
			passwordHashIn = this.hashPassword(userRegistrationModel.password, passwordSaltIn);

		var user = new this.User({
			email: userRegistrationModel.email,
			firstName: userRegistrationModel.firstName,
			lastName: userRegistrationModel.lastName,
			passwordHash: passwordHashIn,
			passwordSalt: passwordSaltIn
		});

		return new uc.ApiResponse({ success: true, extras: { user: user } });
	}

	/**
	 * @method login: Gets email from user, checks vs db, hashes pwd and make sure the password is a match
	 * @param req (Object) :
	 * @param res (Object) :
	 * @param next (Object) :
	 */
	login (req, res, next) {//(email, password, callback) {
		let uc = this,//uc = UserController
			email = req.body.loginEmail,
			password = req.body.loginPassword;

		uc.UserModel.findOne({ email: email }, function (err, user) {
			if (err) {
				res.apiResponse = new uc.ApiResponse({
					success: false,
					error: uc.ApiMessages.DB_ERROR
				});
			}

			if (user) {
				//if (password == user.password)
				if (uc.bcrypt.compareSync(password, user.password)) {
					//	if (passwordHash == user.passwordHash) {
					/*let userProfileModel = new uc.UserProfileModel({email: user.email,alias: user.alias,firstName: user.firstName,lastName: user.lastName,lastLogin: Date.now()});
					uc.session.userProfileModel = userProfileModel;*/

					res.apiResponse = new uc.ApiResponse({
						success: true
					});

					//Go into game if login success
					return GameMenuController.renderGameMenuPage(req, res, next);
				}
				else {//Password Wrong
					res.apiResponse = new uc.ApiResponse({
						success: false,
						error: uc.ApiMessages.LOGIN_FAILED
					});

					return UserController.renderLoginPage(req, res, next);
				}
			}
			else {//Email not found
				res.apiResponse = new uc.ApiResponse({
					success: false,
					error: uc.ApiMessages.LOGIN_FAILED
				});

				return UserController.renderLoginPage(req, res, next);
			}
		});
	}

	logoff () {
		if (this.session.userProfileModal) {
			delete this.session.userProfileModel;
		}
	}

	resetPassword (req, res, next, email, callback) {
		let uc = this;

		req.mailType = 'forgotPassword';
		//MailerController.sendMail(req, res, next);
		return;//TODO PUT THIS IN BELOW

		//Make sure they are a user
		uc.UserModel.findOne({ email: emaill }, function (err, user) {
			if (err) {
				res.apiResponse = new uc.ApiResponse({
					success: false,
					error: uc.ApiMessages.DB_ERROR
				});

				return UserController.renderForgotPasswordPage(req, res, next);
			}

			// Save the user's email and a password reset hash in session. We will use
			//passwordResetHash is used as unique identifier for email to properly identify this user
			let passwordResetHash = uc.uuid.v4();
			uc.session.passwordResetHash = passwordResetHash;
			uc.session.emailWhoRequestedPasswordReset = email;

			//uc.mailer.sendPasswordResetHash(email, passwordResetHash);

			res.apiResponse = new uc.ApiResponse({
				success: true,
				extras: {
					passwordResetHash: passwordResetHash
				}
			});

			return UserController.renderLoginPage(req, res, next);
		});
	}

	resetPasswordFinal (email, newPassword, passwordResetHash, callback) {
		let uc = this;

		if (!uc.session || !uc.session.passwordResetHash) {
			return callback(null, new uc.ApiResponse({
				success: false,
				error: uc.ApiMessages.PASSWORD_RESET_EXPIRED
			}));
		}

		if (uc.session.passwordResetHash !== passwordResetHash) {
			return callback(null, new uc.ApiResponse({
				success: false,
				error: uc.ApiMessages.PASSWORD_RESET_HASH_MISMATCH
			}));
		}

		if (uc.session.emailWhoRequestedPasswordReset !== email) {
			return callback(null, new uc.ApiResponse({
				success: false,
				error: uc.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH
			}));
		}

		let passwordSalt = getHashSalt();

		uc.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {
			uc.UserModel.update({email: email}, {
					passwordHash: passwordHash,
					passwordSalt: passwordSalt
				}, function(err, numberAffected, raw) {
					if (err) {
						return callback(err, new uc.ApiResponse({
							success: false,
							error: uc.ApiMessages.DB_ERROR
						}));
					}

					if (numberAffected < 1) {
						return callback(err, new uc.ApiResponse({
							success: false,
							error: uc.ApiMessages.COULD_NOT_RESET_PASSWORD
						}));
					}
					else {
						return callback(err, new uc.ApiResponse({
							success: true,
							extras: null
						}));
					}
				}
			);
		});
	}

	/**
	 * @method validatePassword: static function to make sure password passes criteria, used in registration and change pwd
	 * @param password (String) : Password input value from login form
	 * @param confirmPassword (String) : Confirm Password input value from login form
	 */
	static validatePassword(password, confirmPassword) {
		let ApiResponse = require('../models/api-response'),
			ApiMessages = require('../models/api-messages');

		//Make sure passwords match
		if(!this.checkPasswordsMatch(password, confirmPassword)) {
			return new ApiResponse({
				success: false,
				error: ApiMessages.NEW_PASSWORDS_MISMATCH
			});
		}
		//TODO Create regex to make sure pwd has 1 uppercase 1 lower case 1 num 1 char

		return new ApiResponse({
			success: true
		});
	}

	/**
	 * @method checkPasswordsMatch: make sure password matches confirm password
	 * @param password (String) : Password input value from login form
	 * @param confirmPassword (String) : Confirm Password input value from login form
	 */
	static checkPasswordsMatch(password, confirmPassword) {
		return password === confirmPassword;
	}

}

module.exports = UserController;