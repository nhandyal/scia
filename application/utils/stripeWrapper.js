var config = require(global.application_root + "config/config"),
	Utils = require(global.application_root + "utils/utils"),
	Stripe = require("stripe")(config[global.env].stripe_key);


var chargeUsingStripeToken = function(user, amount, description, stripeToken, res, onComplete_callback) {

	if(!Utils.isNumeric(amount)) {
		return Utils.sendError(res, 10400);
	}

	console.log("will charge " + user + " the amount " + amount + " for " + description + " using stripe token " + stripeToken);

	amount *= 100;

	Stripe.charges.create({
		amount: amount, 	// amount in cents, again
		currency: "usd",
		card: stripeToken,
		description: description,
	}, function(err, charge) {
		
		if(err) {
			if(err.type === "StripeCardError") {
				// card has been declined
				return Utils.sendError(res, 10100);
			}


			console.log(err);
			return Utils.sendError(res, 10500);
		}

		return onComplete_callback();
	});

};

var chargeUsingStripeCustomerID = function(user, amount, description, stripeCustomerID, res, onComplete_callback) {

};

module.exports.addCard = function(res, customerID, stripeToken, onCompleteCallback) {
	
	Stripe.customers.createCard(
		customerID,
		{card : stripeToken},
		function(err, card) {
			if(err) {
				console.log(err);
				console.log("1");
				return Utils.sendError(res, 10500);
			}

			Stripe.customers.retrieve(customerID, function(err, customer) {
				if(err) {
					console.log(err);
					console.log("2");
					return Utils.sendError(res, 10500);
				}

				return onCompleteCallback(customer);
			}); // end retrieve
		} // end create callback
	);

} // end addCard

module.exports.createCustomerProfile = function(res, description, onCompleteCallback) {
	
	Stripe.customers.create({
		description : description
	}, function(err, customer) {

		if(err) {
			console.log(err);
			return Utils.sendError(res, 10501);
		}
		
		return onCompleteCallback(customer);
	});

};

module.exports.chargeUser = function(user) {
	return {
		theAmount : function(amount) {
			return {
				_for : function(description) {
					return {
						usingStripeToken : function(stripeToken) {
							return {
								onComplete : function(res, onComplete_callback) {
									chargeUsingStripeToken(user, amount, description, stripeToken, res, onComplete_callback);
								}
							};
						},

						usingStripeCustomerID : function(stripeCustomerID) {
							return {
								onComplete : function(res, onComplete_callback) {
									console.log("will charge " + user + " the amount " + amount + " for " + description + " using stripe customer id " + stripeCustomerID);
								}
							};
						}
					};
				}
			};
		}
	};
};