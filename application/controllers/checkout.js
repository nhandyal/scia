
var Stripe = require("stripe")("sk_test_Y60ywef6DTEeL2cwLTIULoxT");

module.exports.test = function(req, res) {
	
	Stripe.charges.create({
		amount: 1000, // amount in cents, again
		currency: "usd",
		card: req.body.stripeToken,
		description: "payinguser@example.com"
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError') {
			// The card has been declined
			console.log(err);
		}

		res.send("success");
	});

};