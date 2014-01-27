/**
 * METHODS
 */

var paths = null;

/**
 * onComplete_callback must accept err, customer
 */
var addCard = function(customerID, stripeToken, onComplete_callback) {
	
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

};

/**
 * onComplete_callback must accept err, customer
 */
var createCustomerProfile = function(profile, onComplete_callback) {
	
	var user = this,
		profilePath = paths.stripe_customer_profile.path_ref;

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
		
		user.profilePath = customer;
		user.markModified(profilePath);

		return onComplete_callback(null, customer);
	});

};


/**
 *
 */
var get = function(field) {

	var path = paths[field].path_ref;
	return this[path];

};


/**
 *
 */
var set = function(field, value) {

	var path = paths[field].path_ref;
	this.path = value;
	this.markModified(path);

}

var methods = {
		addCard : addCard,
		createCustomerProfile : createCustomerProfile,
		get : get,
		set : set
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

}