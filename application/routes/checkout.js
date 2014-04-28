/*
 * This route file handles everything under the /d1/checkout path
 */

var Url = require("url"),
	AuthToken = require(global.application_root + 'utils/authToken'),
	Checkout = require(global.application_root + "controllers/checkout"),
	User = require(global.application_root + "controllers/user");

module.exports = function(app, transport) {

 	app.post('/d1/checkout', AuthToken.authorizeRequest, function(req, res) {
		Checkout.submitPayment(req, res, null);
 		
 		//User.test(req, res);

 	});

 };
