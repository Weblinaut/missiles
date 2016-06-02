/**
 * Our DTO Data Transfer Object (all profile models will act this way)
 *
 * Instances of this Class will help us pass user data from the database to the
 * outer layers of the backend, and ultimately the mobile application, without
 * exposing sensitive information such as the password hash and salt values.
 * Not storing password information in instances of this Model so there is no
 * opportunity for this information to be pulled from the database and sent out
 * as part of an HTTP response.
 */

'use strict';

class UserProfileModel {
	constructor (cnf) {
		this.email = cnf.email;
		this.alias = cnf.alias;
		this.firstName = cnf.firstName;
		this.lastName = cnf.lastName;
		this.paddword = cnf.paddword;
	}
}

module.exports = UserProfileModel;

/*previous way
 (function () {
	 'use strict';
	 let UserProfileModel = function(cnf) {
		 this.email = cnf.email;
		 this.password = cnf.password;//hashed
		 this.passwordSalt = cnf.passwordSalt;//random, created on registration
		 this.alias = cnf.alias;
		 this.firstName = cnf.firstName;
		 this.lastName = cnf.lastName;
		 this.lastLogin = cnf.lastLogin;
	 };

	 module.exports = UserProfileModel;
 });
 */