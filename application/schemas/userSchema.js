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


var UserAuthPluginOptions = {
		paths : {
			first_name : "f_name",
			last_name : "l_name",
			username : "email",
			password : "pwd"
		}
	},

	StripePluginOptions = {
		stripe_key : config[env].stripe_key
	};

var UserAuthPlugin = Utils.loadMongoosePlugin("UserAuth"),
	StripePlugin = Utils.loadMongoosePlugin("Stripe");

userSchema.plugin(UserAuthPlugin, UserAuthPluginOptions);
userSchema.plugin(StripePlugin, StripePluginOptions);


/**
 * onCompleteCallback must accept err, user
 */
userSchema.statics.createNewUser = function(userData, onCompleteCallback) {
	
	var user = new this(userData),
		model = user.model(user.constructor.modelName)
		schema = userSchema;


	try {
		user.UserAuth.setPasswordSync(userData.pwd);
	}catch(err) {
		// password cannot be used
		return onCompleteCallback({
			scia_errcode : 10400
		}, null);
	}

	model.count({email : userData.email}, function(err, count) {
		if(count > 0) {
			return onCompleteCallback({
				scia_errcode : 10001
			}, null);
		}

		user.Stripe.createCustomerProfile({
			email : user.email,
			description : "Profile for " + user.email,
			model : user
		}, function(err, customerProfile) {
		
			if(err) {
				return onCompleteCallback(err, null);
			}

			user.stripe_customer_profile = customerProfile;
			user.markModified('stripe_customer_profile');

			return onCompleteCallback(null, user);

		});

	});

};

mongoose.model("user", userSchema);
