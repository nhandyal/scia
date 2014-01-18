/*
 * This route file handles everything under the /d1/checkout path
 */

var Url = require("url"),
	Checkout = require(global.application_root + "controllers/checkout");

module.exports = function(app, transport) {

 	app.post('/d1/checkout', function(req, res) {
 		
 		Checkout.test(req, res);

 	});

 };