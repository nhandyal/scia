/*
 *	Module to automatically send emails via nodemailer
 */

var nodemailer = require("nodemailer"),
	
	transport = nodemailer.createTransport("SMTP", {
	
		host : "smtp-mail.outlook.com",
		port : 587,
		auth : {
			user : "no_reply@uscscia.com",
			pass : "UePKxUp9zGXdeYaf"
		},

		tls: {ciphers:'TLSv1'}

	});


var send = function(res, email, onComplete_callback) {

	res.render(email.template_path, email, function(err, renderedHtml) {
		transport.sendMail({
			from : email.from,
			to : email.to,
			subject : email.title,
			html : renderedHtml,
			charset : "UTF-8"
		}, function(error, response) {

			if(error) {
				console.log("Error delivering message to " + vrf_email_data.email);
				return console.log(error);
			}
			
			console.log("Message sent: " + response.message);

			onComplete_callback();

		});
	});

}; // end send


module.exports.send = send;
