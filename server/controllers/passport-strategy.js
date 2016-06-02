"use strict";

class PassportStrategy {
	constructor (UserModel) {
		this.passport = require('passport'),
		this.LocalStrategy = require('passport-local').Strategy;

		this.UserModel = UserModel;
	}

	authenticate () {
		let pps = this;

		passport.use(new LocalStrategy(
			function(username, password, done) {
				pps.UserModel.findOne({ username: username }, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, { message: 'Incorrect username.' });
					}
					if (!user.validPassword(password)) {
						return done(null, false, { message: 'Incorrect password.' });
					}
					return done(null, user);
				});
			}
		));
	}

	serializeUser(user) {
		passport.serializeUser(function (user, done) {
			done(null, user.id);
		});
	}

	deserializeUser(user) {
		passport.deserializeUser(function (id, done) {
			User.findById(id, function (err, user) {
				done(err, user);
			});
		});
	}
}

module.exports = PassportStrategy;