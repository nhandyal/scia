module.exports.login = function(pwd, onCompleteCallback) {
	var user = this;

	// ensure the user is verified
	if(!user.is_verified) {
		return onCompleteCallback({
			scia_errcode : 10051
		}, null);
	}

	user.invoke("UAuth.authenticate").withArgs(pwd, function(err, authenticated) {
		if(err) {
			console.log(err);
			return onCompleteCallback(err, null);
		}

		if(!authenticated) {
			return onCompleteCallback({
				scia_errcode : 10050
			}, null);
		}

		return onCompleteCallback(null, user);
	});
};


module.exports.setPassword = function(pwd, onCompleteCallback) {
	var user = this;
	
	try {
		user.invoke("UAuth.set").withArgs("pwd", pwd);
	}catch(err) {
		return onCompleteCallback({
			scia_errcode : 10400
		}, null);
	}

	user.save(function(err) {
		if(err) {
			return onCompleteCallback(err, null);
		}

		return onCompleteCallback(null, user);
	});
};


module.exports.generateRecoverToken = function(onCompleteCallback) {
	var token = Date.now();
	this.update({
		pwd_reset_token : token,
	}, function(err) {		
		if(err) {
			return onCompleteCallback(err, null);
		}

		return onCompleteCallback(null, token);
	});
};


module.exports.verifyRecoverToken = function(candidateRecoverToken) {
	// check that the link is legitamte
	if(candidateRecoverToken != this.pwd_reset_token) {
		return false;
	}

	// check that the link is still valid
	var expirationDate = parseInt(candidateRecoverToken) + (1000 * 60 * 60);
	if(Date.now() >= expirationDate) {
		return false;
	}

	return true;
};


module.exports.verifyUser = function(onCompleteCallback) {
	this.is_verified = true;
	this.save(function(err, user){
		if(err) {
			return onCompleteCallback(err, null);
		}

		return onCompleteCallback(null, user);
	})
};