/*
 * METHODS
 */


/**
 * Asynchronously sets the password for this user model instance. If the input password is null or
 * an empty string an invalid password error is thrown. If there is an existing
 * password, it will be overwritten.
 * 
 * @param password - new password to store for this user.
 */
var setPassword = function(password) {
	
	// ensure we have a valid input
	if(password == null || password == "") {
		throw new Error("Invalid password");
	}

	var user = this;

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {
			throw new Error("Error generating salt");
		} 

		bcrypt.hash(password, salt, function(err, hash) {
			if(err) {
				throw new Error("Error generating pwd hash");
			}
			
			console.log(hash);
			user.password = hash;
			return;
		});
	});
};


/**
 * Synchronously sets the password for this user model instance. If the input password is null or
 * an empty string an invalid password error is thrown. If there is an existing
 * password, it will be overwritten.
 * 
 * @param password - new password to store for this user.
 */
var setPasswordSync = function(password) {
	
	// ensure we have a valid input
	if(password == null || password == "") {
		throw new Error("Invalid password");
	}

	var user = this,
		salt = bcrypt.genSaltSync(SALT_WORK_FACTOR),
		hash = bcrypt.hashSync(password, salt);

		user.pwd = hash;
};


/**
 * Compare the candidate password with the password that is currently stored in the user model.
 * 
 * @param candidatePassword - the password that is to be verified against the current password.
 * @param callback - must accept (err, isMatch).
 */
var verifyPassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.pwd, function(err, isMatch) {
		if(err) {
			return callback(err);	
		}

        callback(null, isMatch);
	});
};


var methods = {
	setPassword : setPassword,
	setPasswordSync : setPasswordSync,
	verifyPassword : verifyPassword
};


module.exports.attach = function(schema, namespace) {

	var functionsToAttach = {};

	// attach all methods
	if(methods) {
		for(var method_name in methods) {
			functionsToAttach[method_name] = methods[method_name];
		}
		schema.methods[namespace] = functionsToAttach;
	}

}