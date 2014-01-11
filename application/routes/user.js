/*
 * This route file handles everything under the /d1/users path
 */

var Url = require("url"),
	user = require(global.application_root + "controllers/user");

module.exports = function(app, transport) {

	app.post('/d1/user/create', function(req, res) {
		user.create(req, res, transport);
	});

	app.post('/d1/user/login', function(req, res) {
		user.login(req, res);
	});

	app.get('/d1/user/logout', function(req, res) {
		user.logout(req, res);
	});

	app.post('/d1/user/resendVerificationEmail', function(req, res) {
		user.resendVerificationEmail(req, res, transport);
	});

	app.post('/d1/user/reset', function(req, res) {
		user.reset(req, res);
	});

	app.get('/d1/user/recover', function(req, res) {
		var queryParams = Url.parse(req.url, true).query;
		
		user.recover(req, res, transport, queryParams);
	});

	app.get('^/d1/user/verify/[A-Za-z0-9]{24}', function(req, res) {
		var userDbID = (req.url).replace("/d1/user/verify/", "");

		user.verifyUser(req, res, userDbID);
	});

};