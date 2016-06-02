'use strict';
var ApiResponse = function (cnf) {
	this.success = cnf.success;
	this.error = cnf.error;
	this.extras = cnf.extras;
};

module.exports = ApiResponse;