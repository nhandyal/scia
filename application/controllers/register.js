var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	VRF = mongoose.model("vrf_token"),
	CIC = mongoose.model("CIC"),
	md5 = require("crypto").createHash("md5"),
	async = require("async"),
	utils = require("./utils")

	getNextCICIndex = function(callback){
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};

module.exports.stageMembership = function(req, res, transport){

	getNextCICIndex(function(dbErr, dbResp){

		// generate the vrf_token
		var vrf_token = "",
			vrf_array = [];

		for(i = 0; i < 6; i++){
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
		},

		vrfData = {
			email : req.body.email,
			vrf_token : vrf_token
		},

		user = new User(userData),
		vrf = new VRF(vrfData);


		async.parallel({
			user : function(callback){
				user.save(function(err, user){
					if(err) 
						return callback(null, false);
					else
						return callback(null, user);
				});
			},
			vrf : function(callback){
				vrf.save(function(err, vrf){
					if(err) 
						return callback(null, false);
					else
						return callback(null, vrf);
				});
			}
		}, function(err, result){
			// ensure there were no failures in the db transactions
			if(!utils.verifyDbTransactions(result)) {
				response = {
					status : 10001,
					short_message : "Internal error",
					long_message : "Unable to stage new user to database"
				};
				utils.sendResponse(res, response);
			} else {
				res.send("done");
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