var mongoose = require("mongoose"),
	bcrypt = require("bcrypt"),
	SALT_WORK_FACTOR = 10,
	StripeHandler = require(global.application_root + "modules/StripeHandler");

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

		member_id 			: {
			type				: Number,
			default				: 000000
		},
		
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
		major 				: {
			type				: String,
			default				: "n/a"
		},
		
		year 				: {
			type				: String,
			default				: "n/a"
		},
		
		
		// mobile elements
		mobile_number 		: {
			type				: Number,
			default				: "0000000000"
		},

		text_notify			: {
			type				: Boolean,
			default				: false
		},

		carrier  			: {
			type				: String,
			default				: "n/a"
		},

		is_phone_verified 	: {
			type				: Boolean,
			default				: false
		},

		// password reset elements
		pwd_reset_token			: Number,

		// stripe customer profile
		stripe_customer_profile : {},
		
	},

	{
		collection: "users"
	}
);

/**
 * Asynchronously sets the password for this user model instance. If the input password is null or
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
userSchema.methods.setPasswordSync = function(password) {
	
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
userSchema.methods.verifyPassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.pwd, function(err, isMatch) {
		if(err) {
			return callback(err);	
		}

        callback(null, isMatch);
	});
};

/**
 * onCompleteCallback must accept err, user
 */
userSchema.methods.addCard = function(stripeToken, onCompleteCallback) {

	var user = this;
	StripeHandler.addCard(user.stripe_customer_profile.id, stripeToken, function(err, customerProfile) {
		
		if(err) {
			return onCompleteCallback(err, null);
		}

		user.stripe_customer_profile = customerProfile;
		user.markModified('stripe_customer_profile');

		return onCompleteCallback(null, user);

	});

};

/**
 * onCompleteCallback must accept err, user
 */
userSchema.statics.createNewUser = function(userData, onCompleteCallback) {
	
	var user = new this(userData);
	
	try {
		user.setPasswordSync(userData.pwd);
	}catch(err) {
		// password cannot be used
		return onCompleteCallback({
			scia_errcode : 10400
		}, null);
	}

	// to ensure we don't create bogus stripe accounts we need to attempt to save the account first to check for a db duplicate
	user.save(function(err, user) {
		
		if(err) {
			return onCompleteCallback(err, null);
		}

		StripeHandler.createCustomerProfile({
			email : user.email,
			description : "Profile for " + user.email
		}, function(err, customerProfile) {
		
			if(err) {
				return onCompleteCallback(err, null);
			}

			user.stripe_customer_profile = customerProfile;
			user.markModified('stripe_customer_profile');

			return onCompleteCallback(null, user);

		});

	});
}

mongoose.model("user", userSchema);