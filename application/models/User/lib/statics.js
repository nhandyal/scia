var mongoose = require("mongoose");

/**
 *
 */
module.exports.findOneByEmail = function(email, onCompleteCallback) {
	var _model = mongoose.model("user");

	_model.findOne({email : email}, function(err, user) {
		if(err) {
			return onCompleteCallback(err, null);
		}

		if(!user) {
			return onCompleteCallback({
				scia_errcode : 10402
			}, null);
		}

		return onCompleteCallback(null, user);
	});
};

module.exports.findOneByID = function(id, onCompleteCallback) {
	var _model = mongoose.model("user");

	_model.findById(id, function(err, user) {
		if(err) {
			return onCompleteCallback(err, null);
		}

		if(!user) {
			return onCompleteCallback({
				scia_errcode : 10402
			}, null);
		}

		return onCompleteCallback(null, user);
	});
}

/**
 * onCompleteCallback must accept err, user
 */
module.exports.create = function(userData, onCompleteCallback) {
	
	var user = new this(userData);
	
	try {
		user.invoke("UAuth.set").withArgs(userData);
	}catch(err) {
		return onCompleteCallback({
			scia_errcode : 10400
		}, null);
	}

	user.invoke("UAuth.isUnique").withArgs(function(err, unique) {
		if(err) {
			return onCompleteCallback(err, null);
		}

		if(unique) {
			user.invoke("Stripe.createCustomerProfile").withArgs({
				email : userData.email,
				description : "Profile for " + userData.email
			}, function(err) {
				if(err) {
					return onCompleteCallback(err, null);
				}

				return onCompleteCallback(null, user);
			});
		}else {
			return onCompleteCallback(null, user);
		}
	});
};