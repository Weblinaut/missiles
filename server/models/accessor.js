/*
(function () {
	'use strict';

	var index = require('../routes/index'),//everything included in here
		express = index.express,
		user = index.user,
		mongoose = require('mongoose'),
		//Mongoose connection to mongo
		db = mongoose.connection,
		//MODELS
		User;

	//TODO UNCOMMENT WHEN FIGURE OUT ERROR WITH REGISTER MODELS!
	//models.registerModels();

	console.log(user);return;
	user.initUserSchema();

	User = mongoose.model('User');

	//mongoose.connect('mongodb://localhost/test');
	mongoose.connect('localhost', 'missiles');

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		var tommy = new User({
			email: 'webdevinci@gmail.com',
			password: 'shoe',
			firstName: 'Tommy',
			lastName: 'Williams'
		});

		tommy.save(function(err) {
			if(err)
			{
				console.error(err);
			}
		});

		//console.log(tommy.login());
	});
}());


//////////

/!*
// Bootstrap express
var app = express();

// URLS management

app.get('/', function (req, res) {
	res.send("<a href='/user'>Show Users</a>");
});

app.get('/user', function (req, res) {
	User.find({}, function (err, docs) {
		res.json(docs);
	});
});

app.get('/user/:email', function (req, res) {
	if (req.params.email) {
		User.find({
			email: req.params.email
		}, function (err, docs) {
			res.json(docs);
		});
	}
});
*!/*/
