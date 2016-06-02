'use strict';
//Nodemailer (email) setup

let nodeMailer = require('nodemailer'),
	// create reusable transporter object using SMTP transport
	transporter = nodeMailer.createTransport({
		/*service: 'gmail',
		auth: {
			user: '@gmail.com',
			pass: ''
		}*/
		service: 'mail.droidtrack.com',
		auth: {
			user: 'twilliams@locationovertime.com',
			pass: 'Dt123!321td'
		}
	}, {
		// default values for sendMail method
		from: 'Missiles',
		headers: {
			'My-Awesome-Header': '123'
		}
	});

module.exports = {
	transporter: transporter,
	mailOptions: {
		from: 'Missiles <admin@missil.es>'/*, // sender address
		to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world ✔', // plaintext body
		html: '<b>Hello world ✔</b>' // html body*/
	}
};