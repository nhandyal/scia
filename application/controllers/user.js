

var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	CIC = mongoose.model("CIC"),
	Url = require("url"),
	Utils = require("./utils"),

	getNextCICIndex = function(callback) {
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};

/**
 * Creates a new user
 * 
 * Possbile failure message codes
 * 		10400, 10001, 10501, 
 */
module.exports.create = function(req, res, transport) {

	var userData = {
			f_name : req.body.f_name,
			l_name : req.body.l_name,
			email : req.body.email,
		},

		user = new User(userData);

	try {
		user.setPasswordSync(req.body.pwd);
	} catch(err){
		// invalid password
		return Utils.sendError(res, 10400);
	}
	
	user.save(function(err, user) {
		if(err) {
			return Utils.processMongooseError(err, res);
		}

		Utils.log("new user created: " + user.f_name + " " + user.l_name + " - " + user._id);

		var vrf_email_data = {
			title : "USC SCIA verification email",
			vrf_link : "https://www.uscscia.com/d1/user/verify?"+user._id,
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
	}); // end user.save
}; // end module create


/**
 * Verify an already created user
 * 
 * Possbile failure message codes
 * 		10400, 10401, 10001, 10501, 
 */
module.exports.verifyUser = function(req, res) {
	var userDbID = (req.url).replace("/d1/user/verify?", "");
	
	User.findOne({ _id : userDbID}, function(err, user) {
		if(err) {
			return Utils.processMongooseError(err, res);
		}

		if(!user) {
			return Utils.sendError(res, 10401);
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

/**
 * Send a verification email to a user that has already been created
 * 
 * Possbile failure message codes
 * 		10400, 10401, 10001, 10501, 
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
			return Utils.sendError(res, 10401);
		}

		var vrf_email_data = {
			title : "USC SCIA verification email",
			vrf_link : "https://www.uscscia.com/d1/user/verify?"+user._id,
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

	});// end user.findOne
}// end module resendVerificationEmail