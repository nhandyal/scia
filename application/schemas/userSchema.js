var mongoose = require("mongoose"),
	bcrypt = require("bcrypt"),
	SALT_WORK_FACTOR = 10;

// create user schema
var userSchema = mongoose.Schema(
	{

		// required elements
		f_name 				: {
			type				: String,
			required			: '{PATH} is required'
		},

		l_name 				: {
			type				: String,
			required			: '{PATH} is required'
		},
		
		email 				: {
			type				: String,
			required			: '{PATH} is required',
			unique				: true
		},

		pwd 				: {
			type				: String,
			required			: '{PATH} is required'
		},

		member_id 				: String 
		vrf_code 				: String,
		
		is_verified 		: {
			type				: Boolean,
			default				: false
		},

		created 			: {
			type 				: Date,
			default				: Date.now
		},

		last_login 			: {
			type 				: Date,
			default				: Date.now
		},

		is_member 			: {
			type				: Boolean,
			default				: false
		},

		is_board 			: {
			type				: Boolean,
			default				: false
		},


		// profile elements
		major 					: String,
		year 					: String,
		
		
		// mobile elements
		mobile_number 			: Number,

		text_notify			: {
			type				: Boolean,
			default				: false
		},

		carrier : 				String,

		is_phone_verified 	: {
			type				: Boolean,
			default				: false
		},

		
	},

	{
		collection: "users"
	}
);

/**
 * Sets the password for this user model instance. If the input password is null or
 * an empty string an invalid password error is thrown. If there is an existing
 * password, it will be overwritten.
 * 
 * @param password - new password to store for this user.
 */
userSchema.methods.setPassword = function(password) {
	
	// ensure we have a valid input
	if(password == null || password == "") {
		throw new Error("Invalid password");
	}

	var user = this;

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {
			throw new Error("Error generating bcrypt salt value");
		} 

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) {
				throw new Error("Error generating bcrypt hash");
			}
			
			user.password = hash;
			return;
		});
	});
};

/**
 * Compare the candidate password with the password that is currently stored in the user model.
 * 
 * @param candidatePassword - the password that is to be verified against the current password.
 * @param callback - must accept (err, isMatch).
 */
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) {
			return callback(err);	
		}

        callback(null, isMatch);
	});
}

mongoose.model("user", userSchema);