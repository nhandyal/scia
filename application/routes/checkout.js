/*
 * This route file handles everything under the /d1/checkout path
 */

var Url = require("url"),
	Checkout = require(global.application_root + "controllers/checkout"),
	User = require(global.application_root + "controllers/user");

module.exports = function(app, transport) {

 	app.post('/d1/checkout', function(req, res) {
 		
 		User.test(req, res);

 	});

 };