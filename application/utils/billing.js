var config = require(global.application_root + "config/config"),
	Utils = require(global.application_root + "utils/utils"),
	Stripe = require("stripe")(config[global.env].stripe_key);


var chargeUsingStripeToken = function(user, amount, description, stripeToken, res, onComplete_callback) {

	Utils.assertIsNumeric(res, amount);

	console.log("will charge " + user + " the amount " + amount + " for " + description + " using stripe token " + stripeToken);

	amount *= 100;

	Stripe.charges.create({
		amount: amount, 	// amount in cents, again
		currency: "usd",
		card: stripeToken,
		description: description,
	}, function(err, charge) {
		
		if(err) {
			console.log(err);
		}

		if (err && err.type === 'StripeCardError') {
			// The card has been declined
			console.log(err);
		}

		onComplete_callback();
	});

};

var chargeUser = function(user) {
	
	var returnObject = {
		
		theAmount : function(amount) {

			var returnObject = {

				_for : function(description) {

					var returnObject = {
						
						usingStripeToken : function(stripeToken) {

							var returnObject = {

								onComplete : function(res, onComplete_callback) {
									chargeUsingStripeToken(user, amount, description, stripeToken, res, onComplete_callback);
								}

							};

							return returnObject;
						},

						usingStripeCustomerID : function(stripeCustomerID) {

							var returnObject = {
								onComplete : function(onComplete_callback) {
									console.log("will charge " + user + " the amount " + amount + " for " + description + " using stripe customer id " + stripeCustomerID);
								}
							};
							
							return returnObject;
						}

					};

					return returnObject;
				}

			};

			return returnObject;
		}

	};

	return returnObject;
};

module.exports.chargeUser = chargeUser;


/*
this._for = function(description) {
			
			this.usingStripeToken = function(stripeToken) {
				console.log("will charge " + user + " the amount " + theAmount + " for " + _for + " using stripe token " + stripeToken);
			};

			this.usingStripeCustomerID = function(stripeCustomerID) {
				console.log("will charge " + user + " the amount " + theAmount + " for " + _for + " using stripe customer id " + stripeCustomerID);
			}

			return this;
		};

		return this;
		*/