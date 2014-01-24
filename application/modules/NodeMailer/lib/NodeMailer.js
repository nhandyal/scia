/*
 *	Module to automatically send emails via nodemailer
 */


// the transport variable has been globally defined and is initialized in /application/config/nodemailer.js
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
