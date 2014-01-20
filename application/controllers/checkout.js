var Billing = require(global.application_root + "utils/billing");


module.exports.test = function(req, res) {
	
	Billing.chargeUser("nikhl").theAmount(50)._for("membership").usingStripeToken(req.body.stripeToken).onComplete(res, function() {
		res.send("done");
	});

};