exports.mapPage = function(req, res) {
	var styleSheets = [
			'stylesheets/map.css',
		],
		javascripts = [
			{
				link: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCbd1re7EHMj7p46ewgzST60MANSli2JBs&callback=mapJs.init',
				attributes: 'async defer'
			},
			{
				link: 'scripts/map.min.js'
			}
		],
		mapPageVars = {
			title: 'Missile Command Registration',
			layout: './templates/masterTemplate',
			body: './partials/loginReg/map',
			bodyClass: 'mapPage',
			styleSheets: styleSheets,
			javascripts: javascripts,
			isLoginPage: false
		};

	res.render('partials/in/map', mapPageVars);
};