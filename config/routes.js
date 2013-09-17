var user = require("../application/controllers/user"),
	nodemailer = require("nodemailer");

module.exports = function(app){
	
	app.get("^/[A-Za-z]{3}[0-9]{3}|^/[0-9]{6}", function(req, res){
		// member id
		res.send("member id: "+req.url);
	});

	app.get('/d1/events*', function(req, res){
		res.send("d1 events: "+req.url);
	});

	app.get('/d1/register*', function(req, res){
		res.send("d1 register: "+req.url);
	});

	app.get('/d1/login*', function(req, res){
		res.send("d1 login: "+req.url);
	});

	app.get('/d1/logout*', function(req, res){
		res.send("d1 logout: "+req.url);
	});

	app.get("/d1/email", function(req, res){
		var transport = nodemailer.createTransport("SMTP", {
			host : "smtp-mail.outlook.com",
			port : 25,
			auth : {
				user : "admin@uscscia.com",
				pass : "Sci@2013"
			},
			debug : true,
			tls: {ciphers:'TLSv1'}
		});

		transport.sendMail(
			{
			 	from : "admin@uscscia.com",
			 	to : "nhandyal@gmail.com",
			 	subject : "test node email",
			 	text : "This is a test email from the scia node server"
			},
			function(error, response){
			   if(error){
			       console.log(error);
			   }else{
			       console.log("Message sent: " + response.message);
			   }
			}
		);
		res.send("Email potentially sent");
	});
}