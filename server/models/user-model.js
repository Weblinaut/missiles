/**
 * the Mongoose model automatically inherits a number of methods
 * (such as create, save, remove and find) that allow us to store
 * and retrieve model instances from a MongoDB database. We will use
 * Mongoose’s help to create a model of a user.
 */

'use strict';

let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ApiResponse = require('../models/api-response'),
	ApiMessages = require('../models/api-messages'),
	UserProfileModel = require('../models/user-profile-model'),
	//session = session,
	//mailer = mailer,
	userSchema = new Schema({
		email: {
			type: String,
			required: true,
			unique: true
		},
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		alias: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},//password hash
		passwordSalt: {
			type: String,
			required: true
		},
		lastLogin: [{
			type: Date,
			default: Date.now
		}]
	},{ collection: 'users' });//name the db 'users'

/**
 * .pre method will do work before a save is called
 * Note: Don't want to hash before, I want hasing to be explicit for now
 */
/*
userSchema.pre('save', function(next) {
		if (this.password) {
			var md5 = crypto.createHash('md5');
			this.password = md5.update(this.password).digest('hex');
		}

		next();
	}
);*/

module.exports = mongoose.model('UserModel', userSchema, 'users');//name the db 'users'