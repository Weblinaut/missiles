'use strict';

class MailerController {
	constructor() {

	}

	/**
	 * sendMail uses smtp to send email
	 * @param req
	 * @param res
	 * @param next
	 */
	static sendMail (req, res, next) {
		let mailer = require('../../config/mailer'),
			//Lookup table (object prop lookup) to handle what to get from req
			mailType = {
				forgotPassword: function() {
					mailer.mailOptions.html = '<h1>Password Reset</h1>' +
						'<p>Please click <strong><a href="#">this link</a></strong> to reset your password.</p>';
				},
				contactForm: function() {
					mailer.mailOptions.subject = 'Missile Command Contact: ' + req.query.subject;
					mailer.mailOptions.html = '';
				}
			};

		//Execute switch statement above to set mail options
		mailType[req.mailType]();

		mailer.transporter.sendMail(mailType[req.mailType], function(error, info){
			console.log(error);
			console.log(info);

			if(error){
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	}
}

module.exports = MailerController;