var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	VRF = mongoose.model("vrf_token"),
	CIC = mongoose.model("CIC"),
	crypto = require("crypto"),
	async = require("async"),
	utils = require("./utils")

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
} // end module create

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
	if(verified){
		utils.sendError(res, 10004);
		return;
	}

	// retrieve both the user data, and the associated vrf_token
	async.parallel({
		user : function(callback){
			User.find({email : accountEmail}, function(err, dbRes){
				dbTransactionCallback(err, dbRes, callback);
			});
		},
		vrf : function(callback){
			VRF.find({email : accountEmail}, function(err, dbRes){
				dbTransactionCallback(err, dbRes, callback);
			});
		}
	}, function(err, result){
		var user = result.user,
			vrf = result.vrf;

		// ensure both operations completed successfully
		if(user.err || vrf.err){
			utils.sendError(res, 10500);
			utils.log(user.err);
			utils.log(vrf.err);
			return;
		}

		user = new User(result.user.dbRes[0]);
		vrf = new VRF(result.vrf.dbRes[0]);

		// check if submitted vrf_code matches vrf code in db
		if((vrf.vrf_token).toLowerCase() != (req.body.vrf_token).toLowerCase()){
			// invalid token
			utils.sendError(res, 10003);
			return;
		}

		// tokens match, update user object to a verified state and delete the vrf_token entry
		utils.sendSuccess(res);
		user.update({verified : true}, function (err, numberAffected, raw){
			if(err){
				utils.log(err);
				utils.log(raw);
			}
		});
		vrf.remove(function(err){
			if(err){
				utils.log(err);
			}
		});
	}); // end async parallel
} // end module verify