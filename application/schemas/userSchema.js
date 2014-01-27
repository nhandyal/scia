var mongoose = require("mongoose");

// create base user schema
var userSchema = mongoose.Schema(
	{

		// required elements
		member_id 			: {
			type				: Number,
			default				: 000000
		},
		
		is_verified 		: {
			type				: Boolean,
			default				: false
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

	},

	{
		collection: "users"
	}
);


var UserAuthOptions = {
		paths : {
			first_name : "f_name",
			last_name : "l_name",
			username : "email",
			password : "pwd"
		}
	},

	StripeOptions = {
		stripe_key : config[env].stripe_key
	};

var mpCore = Utils.loadMPCore();

mpCore.prime(userSchema);
mpCore.loadPlugin(userSchema, "UserAuth", UserAuthOptions);
mpCore.loadPlugin(userSchema, "Stripe", StripeOptions);


/**
 * onCompleteCallback must accept err, user
 */
userSchema.statics.createNewUser = function(userData, onCompleteCallback) {
	
	/*
	model = user.model(user.constructor.modelName)
		schema = userSchema;
		*/


	var user = new this(userData);
	
	/*
	user.invoke("UserAuth.isUnique").withArgs(userData, function(err, user){
		console.log(lol);
	});
	*/

	try {
		user.invoke("UserAuth.set").withArgs(userData);
	}catch(err) {
		console.log(err);
		return onCompleteCallback({
			scia_errcode : 10400
		}, null);
	}

	user.invoke("UserAuth.isUnique").withArgs(function(err, unique) {
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

	/*
	try {
		user.UserAuth.set(userData);
	}catch(err) {
		// password cannot be used
		return onCompleteCallback({
			scia_errcode : 10400
		}, null);
	}
	

	user.UserAuth.isUnique(function(err, unique) {
		
		if(err) {
			return onCompleteCallback(err, null);
		}

		user.Stripe.createCustomerProfile({
			email : userData.email,
			description : "Profile for " + userData.email,
		}, function(err) {
		
			if(err) {
				return onCompleteCallback(err, null);
			}

			return onCompleteCallback(null, user);

		});
	});
	*/
};

mongoose.model("user", userSchema);
