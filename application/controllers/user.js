/**
 * Nikhil Handyal
 * 1/6/14
 * 
 * Controller to handle all interaction with the user model in the database.
 */

var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	NodeMailer = Utils.loadModule("NodeMailer"),
	ResponseHandler = Utils.loadModule("ResponseHandler"),
	AuthToken = require(global.application_root + "utils/authToken"),
	

	getNextCICIndex = function(callback) {
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};


/**
 * Creates a new user.
 * 
 * @route - /d1/user/create
 * @failure - 10001, 10400, 10501
 */
module.exports.create = function(req, res) {

	var userData = {
			f_name : req.body.f_name,
			l_name : req.body.l_name,
			email : req.body.email,
			pwd : req.body.pwd
		};
	
	User.create(userData, function(err, user) {
		if(err) {
			return ResponseHandler.processError(res, err);
		}

		var vrf_email_data = {
			template_path : application_root + "views/email-templates/vrf_email",
			from : "no_reply@uscscia.com",
			to : req.body.email,
			title : "USC SCIA verification email",
			vrf_link : "https://www.uscscia.com/d1/user/verify/"+user.id,
		};

		NodeMailer.send(res, vrf_email_data, function() {});

		var responseData = {
			id 		: user.id
		};

		return ResponseHandler.sendSuccess(res, responseData);
	}); // end User.createNewUser()
}; // end module create


/**
 * Login a user.
 */
module.exports.login = function(req, res) {
	
	var email = req.body.email,
		pwd = req.body.pwd;

	User.findOneByEmail(email, function(err, user) {
		if(err) {
			return ResponseHandler.processError(res, err);
		}

		user.login(pwd, function(err, user) {
			if(err) {
				return ResponseHandler.processError(res, err);
			}

			AuthToken.getNewAuthToken(res, user);
			return ResponseHandler.sendSuccess(res);
		});
	});

};


/**
 * log a user out
 */
module.exports.logout = function(req, res) {
	AuthToken.clearAuthToken(res);
	return ResponseHandler.sendSuccess(res);
}


/**
 * Send a verification email to a user that has already been created
 * 
 * @route - d1/user/resendVerificationEmail
 * @failure - 10001, 10400, 10401, 10501
 */
module.exports.resendVerificationEmail = function(req, res, transport) {
	
	if(!req.body.email) {
		return ResponseHandler.sendError(res, 10400);
	}

	User.checkIfEmailExists(req.body.email, function(err, exists) {
		if(err) {
			return ResponseHandler.processError(res, err);
		}

		if(!exists) {
			return ResponseHandler.sendError(res, 10402);
		}

		var vrf_email_data = {
			template_path : application_root + "views/email-templates/vrf_email",
			from : "no_reply@uscscia.com",
			to : req.body.email,
			title : "USC SCIA verification email",
			vrf_link : "https://www.uscscia.com/d1/user/verify/"+user.id,
		};

		NodeMailer.send(res, vrf_email_data, function() {});

		return ResponseHandler.sendSuccess(res);

	});
};


/*
 * Initiate an account recovery process for a user. This is used if the user
 * has forgotten their login credentials and needs to change their password.
 * 
 * @param queryParams.email - the email address associated with the account we are trying to recover
 * @param queryParams.cb - the web url where the password reset form is located (see docs on why this is done)
 */
module.exports.recover = function(req, res, transport, queryParams) {

	User.findOneByEmail(queryParams.email, function(err, user) {
		if(err) {
			return ResponseHandler.processError(res, err);
		}

		user.generateRecoverToken(function(err, recoverToken) {

			var pwd_reset_data = {
				template_path : application_root + "views/email-templates/pwd_reset_email",
				from : "no_reply@uscscia.com",
				to : user.email,
				title : "SCIA reset account password",
				f_name : user.f_name,
				reset_pwd_link : queryParams.cb + "?id=" + user.id + "&token=" + recoverToken
			};

			NodeMailer.send(res, pwd_reset_data, function(){});

			if(global.env == "test") {
				// we need to send the client the reset token for testing purposes
				return ResponseHandler.sendSuccess(res, {token : recoverToken});
			}
			
			return ResponseHandler.sendSuccess(res);
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


	User.findOneByID(userDbID, function(err, user) {
		if(err) {
			console.log(err);
			console.trace();
			return ResponseHandler.processError(res, err);
		}

		if(user.verifyRecoverToken(token)) {
			user.setPassword(new_pwd, function(err, user) {
				if(err) {
					console.log(err);
					console.trace();
					return ResponseHandler.processError(res, err);
				}

				return ResponseHandler.sendSuccess(res);
			});
		}else {
			return ResponseHandler.sendError(res, 10052);	
		}
	});

};


/**
 * Verify an already created user
 * 
 * @route - /d1/user/verify*
 * @failure - 10001, 10400, 10401, 10501
 */
module.exports.verifyUser = function(req, res, userDbID) {

	User.findOneByID(userDbID, function(err, user) {
		if(err) {
			return ResponseHandler.processError(res, err);
		}

		user.verifyUser(function(err, user) {
			if(err) {
				return ResponseHandler.processError(res, err);
			}

			return ResponseHandler.sendSuccess(res);
		});
	});

}