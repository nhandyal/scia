var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	CIC = mongoose.model("CIC"),
	md5 = require("crypto").createHash("md5"),

	sendResponse = function(res, response){
		res.send(JSON.stringify(response));
	},

	getNextCICIndex = function(callback){
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};

module.exports.stageMembership = function(req, res, transport){

	getNextCICIndex(function(dbErr, dbResp){

		// generate the vrf_token
		var vrf_token = "",
			vrf_array = [];

		for(i = 0; i < 5; i++){
			var element = String.fromCharCode(Math.floor(Math.random() * 25) + 65);
			vrf_token += element;
			vrf_array.push(element);
		}

		var response = {},

		userData = {
			f_name : req.body.f_name,
			l_name : req.body.l_name,
			pwd : md5.update(req.body.pwd).digest("hex"),
			email : req.body.email,
			mobile : req.body.phoneNumber,
			major : req.body.major,
			year : req.body.year,
			card_id : dbResp.CICIndex,
			board : false ,
			verified : false,
			created : new Date(),
			last_login : new Date(),
			vrf_token : vrf_token
		},

		user = new User(userData);

		user.save(function(err, user){
			err = true;
			if(err){
				// there was an error saving the stub to the database
				response = {
					status : 10001,
					short_message : "Internal error",
					long_message : "Unable to stage new user to database"
				};
				sendResponse(res, response);
				return;
			}else {
				// at this point the user stub was successfully saved in the database
				// prepare the verification email and send it on its way

				res.render('email-templates/vrf_email', {
					title : "Welcome to USC SCIA",
					vrf_token : vrf_array
				});
			}
		});
	});
}

	

	

/*

	

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