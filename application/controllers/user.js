/**
 * Nikhil Handyal
 * 1/6/14
 * 
 * Controller to handle all interaction with the user model in the database.
 */

var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	CIC = mongoose.model("CIC"),
	Url = require("url"),
	Utils = require(global.application_root + "utils/utils"),
	AuthToken = require(global.application_root + "utils/authToken");

	getNextCICIndex = function(callback) {
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};


module.exports.login = function(req, res) {

	User.findOne({email : "nhandyal@gmail.com"}, function(err, user) {
		//var authToken = AuthToken.getNewAuthToken(res, user);

		Utils.sendSuccess(res);
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
			email : req.body.email
		},

		user = new User(userData);

	try {
		user.setPasswordSync(req.body.pwd);
	} catch(err){
		// password cannot be used
		return Utils.sendError(res, 10400);
	}
	
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

		Utils.sendSuccess(res, responseData);

	}); // end user.save
}; // end module create


/**
 * Return user details
 */
module.exports.getDetails = function(req, res) {

	
};


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
			vrf_link : "https://www.uscscia.com/d1/user/verify?"+user.id,
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
		Utils.sendSuccess(res);

	}); // end user.findOne
} // end module resendVerificationEmail


/**
 * Verify an already created user
 * 
 * @route - /d1/user/verify*
 * @failure - 10001, 10400, 10401, 10501
 */
module.exports.verifyUser = function(req, res) {
	var userDbID = (req.url).replace("/d1/user/verify/", "");
	

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