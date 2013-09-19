var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	CIC = mongoose.model("CIC"),

	sendResponse = function(res, response){
		res.send(JSON.stringify(response));
	},

	getNextCICIndex = function(callback){
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};

module.exports.stageMembership = function(req, res, transport){

	getNextCICIndex(function(dbErr, dbResp){
		var response = {},

		userData = {
			f_name : req.body.firstName,
			l_name : req.body.lastName,
			pwd : "lol",
			email : req.body.email,
			mobile : req.body.phoneNumber,
			major : req.body.major,
			year : req.body.year,
			card_id : dbResp.CICIndex,
			board : false ,
			verified : false,
			created : new Date(),
			last_login : new Date()
		},

		user = new User(userData);

		res.send(JSON.stringify(userData));
	});
}

	

	/*
	newUser.save(function(err){
		if(err) {
			response = {
				status : 10001,
				short_message : "Internal error",
				long_message : "Unable to stage new user in database"
			};

			sendResponse(res, response);
			return;
		}
	});



	res.render('templates/2col-1-2.ejs', function(err, html) {
		emailHtml = html;
  	});

	transport.sendMail(
		{
		 	from : "admin@uscscia.com",
		 	to : "ravikumar1993@gmail.com",
		 	subject : "Ravi is a faggot (test email)",
		 	html : emailHtml
		},
		function(error, response){
		   if(error){
		       console.log(error);
		   }else{
		       console.log("Message sent: " + response.message);
		   }
		}
	);
	res.send("html email sent?");
	*/