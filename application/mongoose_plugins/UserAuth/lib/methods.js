/*
 * METHODS
 */

var bcrypt = require("bcrypt"),
	SALT_WORK_FACTOR = 10;
	paths = null;

/**
 * Synchronously sets the password for this user model instance. If the input password is null or
 * an empty string an invalid password error is thrown. If there is an existing
 * password, it will be overwritten.
 * 
 * @param password - new password to store for this user.
 */
var setPassword = function(newPassword) {
	
	// ensure we have a valid input
	if(newPassword == null || newPassword == "") {
		throw new Error("Invalid password");
	}

	var	salt = bcrypt.genSaltSync(SALT_WORK_FACTOR),
		hash = bcrypt.hashSync(newPassword, salt),
		passwordPath = paths.password.path_ref;



		this[passwordPath] = hash;
		this.markModified(passwordPath);

};


/**
 * Compare the candidate password with the password that is currently stored in the user model.
 * 
 * @param candidatePassword - the password that is to be verified against the current password.
 * @param callback - must accept (err, isMatch).
 */
var verifyPassword = function(candidatePassword, callback) {

	var storedPassword = get.call(this, "password");

	bcrypt.compare(candidatePassword, storedPassword, function(err, isMatch) {
		if(err) {
			return callback(err);	
		}

        callback(null, isMatch);
	});
};


/**
 * Gets a field stored by this plugin. The field can be a default
 * key or a mapped key.
 */
var get = function(field) {

	var path = paths[field].path_ref;
	return this[path];

};


/**
 * Sets schema values
 * if field is an object, will set the key value pairs, otherwise
 * simply sets a single field and value. The keys can be default plugin
 * values, or mapped values.
 */
var set = function(field, value) {

	if(typeof field === "object") {
		for(var key in field) {
			if(key in paths) {
				var path = paths[key].path_ref;
				if(paths[key].origin === "password") {
					setPassword.call(this, field[key]);
				}else {
					this.path = field[key];
					this.markModified(path);
				}
			}
		}
	}else {
		var path = paths[field].path_ref;
		if(paths[key].origin === "password") {
			setPassword.call(this, value);
		}else {
			this.path = value;
			this.markModified(path);
		}
	}

};


var isUnique = function(onCompleteCallback) {

	var model = this.model(this.constructor.modelName),
		unique_path = paths.username.path_ref;

	model.count({unique_path : this.unique_path}, function(err, count) {
		if(err) {
			return onCompleteCallback(err, null);
		}

		if(count > 0) {
			return onCompleteCallback(null, false);
		}else {
			return onCompleteCallback(null, true);
		}

	});

}

var methods = {
	setPassword : setPassword,
	verifyPassword : verifyPassword,
	get : get,
	set : set,
	isUnique : isUnique
};


module.exports.attach = function(schema, namespace, new_paths) {

	paths = new_paths;
	var functionsToAttach = {};

	// attach all methods
	if(methods) {
		for(var method_name in methods) {
			functionsToAttach[method_name] = methods[method_name];
		}
		schema.methods[namespace] = functionsToAttach;
	}
	
};