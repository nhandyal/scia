var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
	host : "smtp-mail.outlook.com",
	port : 25,
	auth : {
		user : "no_reply@uscscia.com",
		pass : "UePKxUp9zGXdeYaf"
	},
	tls: {ciphers:'TLSv1'}
});

module.exports = transport;