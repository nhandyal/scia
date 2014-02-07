/*
 * This route file handles everything under the /d1/user path
 */

var Url = require("url"),
	AuthToken = require(global.application_root + 'utils/authToken'),
	user = require(global.application_root + "controllers/user");

module.exports = function(app, transport) {

	/**
	 * @param req.body.f_name - user first name
	 * @param req.body.l_name - user last name
	 * @param req.body.email - user email
	 * @param req.body.pwd - user password (cannot be "")
	 */
	app.post('/d1/user/create', function(req, res) {
		var params = {
			f_name : req.body.f_name,
			l_name : req.body.l_name,
			email : req.body.email,
			pwd : req.body.pwd
		};

		user.create(res, params);
	});

	/**
	 * @param req.body.email - user email
	 * @param req.body.pwd - user password
	 */
	app.post('/d1/user/login', function(req, res) {
		var params = {
			email : req.body.email,
			pwd : req.body.pwd
		};

		user.login(res, params);
	});

	app.get('/d1/user/logout', function(req, res) {
		user.logout(res);
	});

	/**
	 * @param req.body.email - user email
	 */
	app.post('/d1/user/resendVerificationEmail', function(req, res) {
		var params = {
			email : req.body.email
		};
		
		user.resendVerificationEmail(res, params);
	});

	/**
	 * @url /d1/user/recover?email={user email}&cb={reset form url}
	 */
	app.get('/d1/user/recover', function(req, res) {
		var params = Url.parse(req.url, true).query;
		
		user.recover(res, params);
	});

	/**
	 * @param req.body.id - id of user
	 * @param req.body.token - reset token provided by server for this user
	 * @param req.body.new_pwd - new user password
	 */
	app.post('/d1/user/reset', function(req, res) {
		var params = {
			id : req.body.id,
			token : req.body.token,
			new_pwd : req.body.new_pwd
		};

		user.reset(res, params);
	});

	/**
	 * url schema /d1/user/verify/{user id}
	 */
	app.get('^/d1/user/verify/[A-Za-z0-9]{24}', function(req, res) {
		var params = {
			id : (req.url).replace("/d1/user/verify/", "")
		};

		user.verifyUser(res, params);
	});

	app.get('/d1/user/test', AuthToken.authorizeRequest, function(req, res) {

		res.send("done");
	})

};