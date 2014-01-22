var config = require(global.application_root + "config/config"),
	Utils = require(application_root + "modules/Utils"),
	Stripe = require("stripe")(config[global.env].stripe_key);

/**
 * onComplete_callback must accept err, customer
 */
module.exports.addCard = function(customerID, stripeToken, onComplete_callback) {
	
	Stripe.customers.createCard(
		customerID,
		{card : stripeToken},
		function(err, card) {
			if(err) {
				console.log(err);
				return onComplete_callback({
					scia_errcode : 10500
				}, null);
			}

			Stripe.customers.retrieve(customerID, function(err, customer) {
				
				if(err) {
					console.log(err);
					return onComplete_callback({
						scia_errcode : 10500
					}, null);
				}

				return onComplete_callback(null, customer);

			}); 
		}
	);
}

/**
 * onComplete_callback must accept err, customer
 */
module.exports.createCustomerProfile = function(profile, onComplete_callback) {
	
	Stripe.customers.create({
		email : profile.email,
		description : profile.description
	}, function(err, customer) {

		if(err) {
			console.log(err);
			return onComplete_callback({
				scia_errcode : 10500
			}, null);
		}
		
		return onComplete_callback(null, customer);
	});

};