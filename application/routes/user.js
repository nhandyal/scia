/*
 * This route file handles everything under the /d1/users path
 */

var user = require(global.application_root + "controllers/user");

module.exports = function(app, transport) {

	app.post('/d1/user/create', function(req, res) {
		user.create(req, res, transport);
	});

	app.post('/d1/user/login', function(req, res) {
		user.login(req, res);
	});

	app.get('/d1/user/logout', function(req, res){
		user.logout(req, res);
	});

	app.post('/d1/user/resendVerificationEmail', function(req, res) {
		user.resendVerificationEmail(req, res, transport);
	});

	app.get('^/d1/user/verify/[A-Za-z0-9]{24}', function(req, res) {
		user.verifyUser(req, res);
	});

};