'use strict';

let pageVars = function () { };

	pageVars.registerPageVars = {
		title: 'Missile Command - Registration',
		layout: './templates/masterTemplate',
		body: './partials/loginReg/register',
		bodyClass: 'registerPage',
		styleSheets: ['stylesheets/nukeBgWrapper.css'],
		javascripts: [{
			link: 'scripts/register.min.js'
		}],
		isLoginPage: false
	};

	//If register successful, take to login page
	pageVars.loginPageVars = {
		title: 'Missile Command - Login',
		layout: './templates/masterTemplate',
		body: './partials/loginReg/login',
		bodyClass: 'registerPage',
		styleSheets: ['stylesheets/nukeBgWrapper.css'],
		javascripts: [{
			link: 'scripts/login.min.js'
		}],
		isLoginPage: false
	};

	//Forgot pwd page
	pageVars.forgotPasswordPageVars = {
		title: 'Missile Command - Forgot Password',
		layout: './templates/masterTemplate',
		body: './partials/loginReg/forgotPassword',
		bodyClass: 'forgotPasswordPage',
		styleSheets: ['stylesheets/nukeBgWrapper.css'],
		javascripts: [{
			//link: 'scripts/login.min.js'
		}],
		isLoginPage: false
	};

	//Game Menu
	pageVars.gameMenuVars = {
		title: 'Missiles - Command Center',
		layout: './templates/masterTemplate',
		body: './partials/in/gameMenu',
		bodyClass: 'gameMenuPage',
		styleSheets: [
			'stylesheets/gameMenu.css',
			'stylesheets/nukeBgWrapper.css'
		],
		javascripts: [{
			link: 'scripts/gameMenu.min.js'
		}]
	};

module.exports = pageVars;