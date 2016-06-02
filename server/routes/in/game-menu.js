'use strict';
let GameMenuController = require('../../controllers/game-menu-controller'),
	UserModel = require('../../models/user-model');

module.exports = function(app) {
	app.route('/gameMenu')
		.get(GameMenuController.renderGameMenuPage)
		.post(GameMenuController.renderGameMenuPage);
};