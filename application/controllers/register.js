var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	VRF = mongoose.model("vrf_token"),
	CIC = mongoose.model("CIC"),
	crypto = require("crypto"),
	async = require("async"),
	utils = require("./utils"),
	auth = require("./auth"),

	getNextCICIndex = function(callback){
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	},

	dbTransactionCallback = function(err, dbRes, callback){
		var transactionSummary = {
			err : err,
			dbRes : dbRes
		};
		return callback(null, transactionSummary);
	}

module.exports.create = function(req, res, transport){

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
			md5 = crypto.createHash("md5"),

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
				user.save(function(err, dbRes){
					dbTransactionCallback(err, dbRes, callback);
				});
			},
			vrf : function(callback){
				vrf.save(function(err, dbRes){
					dbTransactionCallback(err, dbRes, callback);
				});
			}
		}, function(err, result){
			// ensure there were no failures in the db transactions
			var transactionResult = utils.verifyDbWrites(result);
			if (transactionResult == 11000) {
				utils.sendError(res, 10002);
				return;
			}
			else if(transactionResult != 0){
				utils.sendError(res, 10001);
				return;
			}
			
			var vrf_email_data = {
				title : "USC SCIA verification email",
				vrf_token : vrf_array,
				email : req.body.email
			};
			res.render('email-templates/vrf_email', vrf_email_data, function(err, renderedHtml) {
				transport.sendMail({
					from : "no_reply@uscscia.com",
					to : vrf_email_data.email,
					subject : vrf_email_data.title,
					html : renderedHtml,
					charset : "UTF-8"
				}, function(error, response){
					if(error){
						utils.log("Error delivering message to " + vrf_email_data.email);
			   		}else{
			       		utils.log("Message sent: " + response.message);
			   		}
				}); // end transport.sendMail
			}); // end res.render
			utils.sendSuccess(res);

		}); // end async parallel
	}); // end getCICIndex
}; // end module create

module.exports.verify = function(req, res){
	var accountEmail = req.cookies.sem;
	var verified = req.cookies.svrf
	

	/*
	 * verify user login by ensuring the server cookie you are expecting exists
	 * This code should be refactored into a global Utils function, but that can be done later
	 */
	if(!accountEmail){
		utils.sendError(res, 10403);
		return;
	}

	if(verified === true){
		utils.sendError(res, 10004);
		return;
	}

	// retrieve the associated vrf_token
	VRF.find({email : accountEmail}, function(err, dbRes){
		
		if(err){
			utils.sendError(res, 10500);
			utils.log(user.err);
			utils.log(vrf.err);
			return;
		}
		
		var vrf = dbRes[0];

		// check if submitted vrf_code matches vrf code in db
		if((vrf.vrf_token).toLowerCase() != (req.body.vrf_token).toLowerCase()){
			// invalid token
			utils.sendError(res, 10003);
			return;
		}

		/*
		 * At this point the tokens match so we need to do a series of things. (in this order)
		 * 1.) Push updated authCookie values down to the client
		 * 2.) Send json response string to client
		 * 3.) Update the user document and delete the vrf_token document in the db
		 */
		
		var svrfUpdate = auth.updateAuthToken(res, "svrf", true),
			vrfUpdate = auth.updateAuthToken(res, "vrf", true);

		if(!(svrfUpdate && vrfUpdate)){
			utils.log("Error Pushing Cookies");
		}

		utils.sendSuccess(res);

		
		User.update({email : accountEmail}, {verified : true}, null, function (err, numberAffected){
			if(err)
				utils.log(err);
		});

		VRF.remove({email : accountEmail}, function(err){
			if(err)
				utils.log(err);
		});
		
	}); // end VRF.find
}; // end module verify

module.exports.resendVerificationEmail = function(req, res){
	var accountEmail = req.cookies.sem;
	
	// verify user is logged it
	if(!accountEmail){
		utils.sendError(res, 10403);
		return;
	}

	var vrf_token = "",
		vrf_array = [];

	for(i = 0; i < 6; i++){
		var element = String.fromCharCode(Math.floor(Math.random() * 25) + 65);
		vrf_token += element;
		vrf_array.push(element);
	}

	// update the vrf token in the db
	VRF.update({email : accountEmail}, {vrf_token : vrf_token}, null, function (err, numberAffected){
		if(err)
			utils.log(err);
	});

	var vrf_email_data = {
		title : "USC SCIA verification email",
		vrf_token : vrf_array,
		email : accountEmail
	};
	res.render('email-templates/vrf_email', vrf_email_data, function(err, renderedHtml) {
		transport.sendMail({
			from : "no_reply@uscscia.com",
			to : vrf_email_data.email,
			subject : vrf_email_data.title,
			html : renderedHtml,
			charset : "UTF-8"
		}, function(error, response){
			if(error) {
				utils.log("Error delivering message to " + vrf_email_data.email);
	   		} else{
	       		utils.log("Message sent: " + response.message);
	   		}
		}); // end transport.sendMail
	}); // end res.render
	utils.sendSuccess(res);

}; // resendVerificationEmail