/**
 * Nikhil Handyal
 * 1/6/14
 * 
 * Controller to handle all interaction with the user model in the database.
 */

var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	CIC = mongoose.model("CIC"),
	Utils = require(global.application_root + "utils/utils"),
	AuthToken = require(global.application_root + "utils/authToken"),

	getNextCICIndex = function(callback) {
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};


module.exports.test = function(req, res) {

	var user = User.findOne({email : "nhandyal@gmail.com"}, function(err, user) {
		if(err) {
			return Utils.processMongooseError(err, res);
		}

		user.addCard(res, req.body.stripeToken, function(user) {
			user.save(function(err, user) {
				if(err) {
					console.log(err);
					return Utils.sendError(res, 10501);
				}

				return Utils.sendSuccess(res);
			});
		});
	});

}


/**
 * Creates a new user.
 * 
 * @route - /d1/user/create
 * @failure - 10001, 10400, 10501
 */
module.exports.create = function(req, res, transport) {

	var userData = {
			f_name : req.body.f_name,
			l_name : req.body.l_name,
			email : req.body.email,
			pwd : req.body.pwd
		};

	User.createNewUser(res, userData, function(user) {

		user.save(function(err, user) {
			
			if(err) {
				return Utils.processMongooseError(err, res);
			}

			Utils.log("new user created: " + user.f_name + " " + user.l_name + " - " + user.id);

			var vrf_email_data = {
				title : "USC SCIA verification email",
				vrf_link : "https://www.uscscia.com/d1/user/verify/"+user.id,
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
						Utils.log("Error delivering message to " + vrf_email_data.email);
					}else{
						Utils.log("Message sent: " + response.message);
					}
				});
			});

			var responseData = {
				id 		: user.id
			};

			return Utils.sendSuccess(res, responseData);
		}); // end user.save
	}); // end User.createNewUser()
}; // end module create


/**
 * Return user details
 */
module.exports.getDetails = function(req, res) {

	
};

/**
 * Login a user.
 */
module.exports.login = function(req, res) {

	
	var email = req.body.email,
		pwd = req.body.pwd;

	User.findOne({email : email}, function(err, user) {
		
		if(err) {
			return Utils.processMongooseError(err, res);
		}

		// ensure the user is verified
		if(!user.is_verified) {
			return Utils.sendError(res, 10051);
		}

		user.verifyPassword(pwd, function(err, authenticated) { 
			if(err) {
				console.log(err);
				return Utils.sendError(res, 10500);
			}

			if(!authenticated) {
				return Utils.sendError(res, 10050);
			}

			user.update({'last_login' : Date.now()}, function(err) {
				if(err) {
					console.log(err);
					console.trace();
				}
			});

			AuthToken.getNewAuthToken(res, user);
			return Utils.sendSuccess(res);

		});

	});

}; // end module login


/**
 * log a user out
 */
module.exports.logout = function(req, res) {
	AuthToken.clearAuthToken(res);
	return Utils.sendSuccess(res);
}


/**
 * Send a verification email to a user that has already been created
 * 
 * @route - d1/user/resendVerificationEmail
 * @failure - 10001, 10400, 10401, 10501
 */
module.exports.resendVerificationEmail = function(req, res, transport) {
	
	try {
		var email = req.body.email;
	} catch(err) {
		return Utils.sendError(res, 10400);
	}

	User.findOne({ email : email}, function(err, user){
		if(err) {
			return Utils.processMongooseError(err, res);
		}

		if(!user) {
			return Utils.sendError(res, 10402);
		}

		var vrf_email_data = {
			title : "USC SCIA verification email",
			vrf_link : "https://www.uscscia.com/d1/user/verify/"+user.id,
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
					Utils.log("Error delivering new user message to " + vrf_email_data.email);
				}else{
					Utils.log("New user message sent to : " + vrf_email_data.email + " --- " + response.message);
				}
			});
		});
		return Utils.sendSuccess(res);

	}); // end user.findOne
} // end module resendVerificationEmail


/*
 * Initiate an account recovery process for a user. This is used if the user
 * has forgotten their login credentials and needs to change their password.
 * 
 * @param queryParams.email - the email address associated with the account we are trying to recover
 * @param queryParams.cb - the web url where the password reset form is located (see docs on why this is done)
 */
module.exports.recover = function(req, res, transport, queryParams) {

	User.findOne({email : queryParams.email}, function(err, user) {

		if(err) {
			return Utils.processMongooseError(err, res);
		}

		if(!user) {
			return Utils.sendError(res, 10402);
		}

		// the pwd reset token is simply the UTC time in ms of when the request was initiated
		var token = Date.now();
		user.update({
			pwd_reset_token : token,
		}, function(err) {
			
			if(err) {
				return Utils.processMongooseError(err, res);
			}

			var pwd_reset_data = {
				email : user.email,
				title : "SCIA reset account password",
				f_name : user.f_name,
				reset_pwd_link : queryParams.cb + "?id=" + user.id + "&token=" + token
			};

			res.render('email-templates/pwd_reset_email', pwd_reset_data, function(err, renderedHtml) {
				transport.sendMail({
					from : "no_reply@uscscia.com",
					to : pwd_reset_data.email,
					subject : pwd_reset_data.title,
					html : renderedHtml,
					charset : "UTF-8"
				}, function(error, response){
					if(error){
						Utils.log("Error delivering reset password message to " + pwd_reset_data.email);
					}else{
						Utils.log("Reset password message sent to : " + pwd_reset_data.email + " -- " + response.message);
					}
				});
			});

			if(global.env == "test") {
				// we need to send the client the reset token for testing purposes
				return Utils.sendSuccess(res, {token : token});
			}

			return Utils.sendSuccess(res);
		});

	});
};


/*
 * Reset the password for a user.
 *
 * @param req.body.id 		- id of user that needs a password reset
 * @param req.body.token 	- credential token authenticating this reset request
 * @param req.body.new_pwd 	- new user password
 */
module.exports.reset = function(req, res) {

	var userDbID = req.body.id,
		token = req.body.token,
		new_pwd = req.body.new_pwd;

	User.findById(userDbID, function(err, user) {

		if(err) {
			return Utils.processMongooseError(err, res);
		}

		if(!user) {
			return Utils.sendError(res, 10402);
		}

		// check that the link is legitamte
		if(token != user.pwd_reset_token) {
			return Utils.sendError(res, 10052);	
		}

		// check that the link is still valid
		var expirationDate = parseInt(token) + (1000 * 60 * 60);
		if(Date.now() >= expirationDate) {
			// this link has expired
			console.log("link has expired");
			return Utils.sendError(res, 10052);
		}

		// all clear, set the password to new_pwd
		try {
			user.setPasswordSync(new_pwd);
		} catch(err){
			// password cannot be used
			return Utils.sendError(res, 10400);
		}

		user.save(function(err) {
			if(err) {
				console.log(err);
				console.trace();
				return Utils.sendError(res, 10501);
			}

			return Utils.sendSuccess(res);
		});

	});
	
};


/**
 * Verify an already created user
 * 
 * @route - /d1/user/verify*
 * @failure - 10001, 10400, 10401, 10501
 */
module.exports.verifyUser = function(req, res, userDbID) {

	User.findById(userDbID, function(err, user) {

		if(err) {
			return Utils.processMongooseError(err, res);
		}

		if(!user) {
			return Utils.sendError(res, 10402);
		}
		
		user.is_verified = true;
		user.save(function(err){
			if(err) {
				return Utils.processMongooseError(err, res);
			}

			return Utils.sendSuccess(res);
		})
		
	});
}