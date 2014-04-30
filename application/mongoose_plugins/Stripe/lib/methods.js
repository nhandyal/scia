/**
 * METHODS
 */

var processStripeError = function(err) {
	switch (err.type) {
  		case 'StripeCardError':
  			return {
  				type : "StripeError",
  				code : 10601,
  				msg : err.code + " -- " + err.message
  			};
			break;
		case 'StripeInvalidRequestError':
			console.log(err);
			console.trace();
			return {
				type : "StripeError",
  				code : 10602,
  				msg : err.code + " -- " + err.message
  			};
			break;
		default:
			console.log(err);
			console.trace();
			return err;
			break;
	}
};

// we are passing on the stipe processing fee to our customers
// Stripe fees (as of 2/7/14) 2.9% + 30 cents
var adjustForStripeFees = function(amount) {
	return Math.floor((amount * 1.029) + 30);
}

var SchemaMethods = function(paths, Stripe) {

	/**
	 * onCompleteCallback must accept err, customer
	 * @param params.stripeCardToken - card to add to customer profile
	 */
	var addCard = function(params, onCompleteCallback) {
		var user = this,
			profilePath = paths.stripe_customer_profile.path_ref;
			customerID = user[profilePath].id,
			stripeCardToken = params.stripeCardToken;

		Stripe.customers.createCard(customerID, {card : stripeCardToken}, function(err, card) {
			if(err) {
				return onCompleteCallback(processStripeError(err), null);
			}

			Stripe.customers.retrieve(customerID, function(err, customer) {
				if(err) {
					return onCompleteCallback(processStripeError(err), null);
				}

				user[profilePath] = customer;
				user.markModified(profilePath);
				
				return onCompleteCallback(null, card);
			}); 
		});
	};

	/**
	 * @param params.cardID - id of card to charge, must already be saved to 
	 							customer profile. This is not a stripe token.
	 * @param params.amount - amount to charge card (in dollars)
	 * @param params.description - description of charge
	 */
	var chargeExistingCard = function(params, onCompleteCallback) {
		var user = this,
			profilePath = paths.stripe_customer_profile.path_ref,
			customerID = user[profilePath].id;

		// convert dollars to cents for stripe processing
		var amount = adjustForStripeFees(parseInt(params.amount) * 100);

		if(amount < 0 || (!params.cardID)) {
			return onCompleteCallback({
				code : 10400
			}, null);
		}

		Stripe.charges.create({
			amount : amount,
			currency : "usd",
			customer : customerID,
			card : params.cardID,
			description : params.description
		}, function(err, charge) {
			if(err) {
				return onCompleteCallback(processStripeError(err), null);
			}

			return onCompleteCallback(null, charge);
		});
	};


	/**
	 * @param params.stripeCardTokem - stripe card token
	 * @param params.amount - amount to charge card (in dollars)
	 * @param params.description - description of charge
	 */
	var chargeNewCard = function(params, onCompleteCallback) {
		var user = this;
		
		// convert dollars to cents for stripe processing
		var amount = adjustForStripeFees(parseInt(params.amount) * 100);

		if(amount < 0 || (!params.stripeCardToken)) {
			return onCompleteCallback({
				code : 10400
			}, null);
		}

		Stripe.charges.create({
			amount : amount,
			currency : "usd",
			card : params.stripeCardToken,
			description : params.description
		}, function(err, charge) {
			if(err) {
				console.log(params);
				return onCompleteCallback(processStripeError(err), null);
			}
			debugger;
			return onCompleteCallback(null, charge);
		});
	};


	/**
	 * onCompleteCallback must accept err, customer
	 */
	var createCustomerProfile = function(params, onCompleteCallback) {
		var user = this,
			profilePath = paths.stripe_customer_profile.path_ref;

		Stripe.customers.create({
			email : params.email,
			description : params.description
		}, function(err, customer) {

			if(err) {
				return onCompleteCallback(processStripeError(err), null);
			}
			
			user[profilePath] = customer;
			user.markModified(profilePath);

			return onCompleteCallback(null, user);
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


	return {
		instanceMethods : {
			addCard : addCard,
			createCustomerProfile : createCustomerProfile,
			set : set,
			chargeExistingCard : chargeExistingCard,
			chargeNewCard : chargeNewCard
		}
	};
}




module.exports.attach = function(schema, namespace, new_paths, Stripe) {

	var _schemaMethods = new SchemaMethods(new_paths, Stripe),
		functionsToAttach = {};

	// attach all methods
	if(_schemaMethods.instanceMethods) {
		var instanceMethods = _schemaMethods.instanceMethods;
		for(var method_name in instanceMethods) {
			functionsToAttach[method_name] = instanceMethods[method_name];
		}

		schema.methods[namespace] = functionsToAttach;
	}
};