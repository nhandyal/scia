module.exports.login = function(pwd, onCompleteCallback) {
	var user = this;

	// ensure the user is verified
	if(!user.is_verified) {
		return onCompleteCallback({
			scia_errcode : 10051
		}, null);
	}

	user.invoke("UAuth.login").withArgs(pwd, function(err, authenticated) {
		if(err) {
			console.log(err);
			return onCompleteCallback(err, null);
		}

		return onCompleteCallback(null, authenticated);
	});
};

