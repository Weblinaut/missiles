//FIX gulp after updating to node 4: http://fettblog.eu/gulp-and-node4-first-aid/
//Use these rules!!!! link below
//https://blog.heroku.com/archives/2015/11/10/node-habits-2016?c=70130000000NY6XAAW&utm_campaign=Newsletter_November_2015&utm_medium=email&utm_source=newsletter&utm_content=blog&utm_term=node-habits-2016
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let config = require('./config/config'),
	mongoose = require('./config/mongoose'),
	express = require('express'),
	passport = require('passport'),
	//app express object
	db = mongoose(),
	app = express(),
	//session = require('client-sessions'),
	expressSession = require('express-session'),
	//RedisStore = require('connect-redis'),
	path = require('path'),
	//fs = require('fs'),//added in tutorial
	hbs = require('hbs'),//added in tutorial
	//exphbs  = require('express-handlebars'),
	//favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views/partials/loginReg');
hbs.registerPartials(__dirname + '/views/partials/in');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Routing files and dirs
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bootstrap',  express.static(__dirname + '/bower_components/bootstrap/dist/js'));
app.use('/jquery',  express.static(__dirname + '/bower_components/jquery/dist'));
app.use('/handlebars',  express.static(__dirname + '/bower_components/handlebars'));

/*****************
 Passport sessions
******************/
app.use(expressSession({
	secret: config.passportSecret,
	name: 'node_pp_session',
	//store: sessionStore, // connect-mongo session store
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

/*****************
 URL Routing
 ******************/
//Not logged in
require('./server/routes/login')(app);
require('./server/routes/register')(app);
require('./server/routes/forgot-password')(app);
//Logged in
require('./server/routes/in/game-menu')(app);

/*****************
 Node error handling
 (TODO Add logging)
 ******************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found, AHHHHHH');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

/*

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
 /*
//Session handling
app.use(session({
	cookieName: 'sessionMis',
	secret: '535510n53cr37!?',
	duration: 30 * 60 * 1000,
	activeDuration: 10 * 60 * 1000,
}));
*/

module.exports = app;