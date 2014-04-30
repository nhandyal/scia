/*
 * This route file handles everything under the /d1/user path
 */

var Url = require("url"),
	AuthToken = require(global.application_root + 'utils/authToken'),
	user = Utils.loadController("user");

module.exports = function(app) {


	/**
	 * login required
	 * 
	 * User details can be queried using a user id. A user id is a 24 character alphanumeric
	 * value that uniquely identifies all users in the system (it is there mongo id).
	 */
	app.get("^/d1/user/[A-Za-z0-9]{24}", AuthToken.authorizeRequest, function(req, res) {
		var id = ((req.url).replace("/d1/user/", "")),
		params = {
			user_id : id
		};

		user.get_details(res, params);
	});


	/**
	 * The callback param must be a base url w/o any query params
	 * The callback url will be called with action=verified as a query param
	 *
	 * @param req.body.f_name - user first name
	 * @param req.body.l_name - user last name
	 * @param req.body.email - user email
	 * @param req.body.pwd - user password (cannot be "")
	 * @param req.body.cb - callback for verify
	 * @return 10001, 10400, 10501
	 */
	app.post('/d1/user/create', function(req, res) {
		var params = {
			f_name : req.body.f_name,
			l_name : req.body.l_name,
			email : req.body.email,
			pwd : req.body.pwd,
			cb : req.body.cb,
			origin : req.get("host")
		};

		user.create(res, params);
	});

	/**
	 * @param req.body.email - user email
	 * @param req.body.pwd - user password
	 * @return 10402, 10050
	 */
	app.post('/d1/user/login', function(req, res) {
		var params = {
			email : req.body.email,
			pwd : req.body.pwd
		};

		user.login(res, params);
	});

	app.post('/d1/user/logout', function(req, res) {
		user.logout(res);
	});

	/**
	 *
	 * The callback param must be a base url w/o any query params
	 * The callback url will be called with action=verified as a query param
	 *
	 * @param req.body.email - user email
	 * @param req.body.cb - callback
	 */
	app.post('/d1/user/resendVerificationEmail', function(req, res) {
		var params = {
			email : req.body.email,
			cb : req.body.cb,
			origin : req.get("host")
		};
		
		user.resendVerificationEmail(res, params);
	});

	/**
	 * The callback param must be a base url w/o any query params
	 * The callback url will be called with the following queryParams
	 * id=<user_id>
	 * token=<reset_token>
	 * action=recover
	 *
	 * @url /d1/user/recover?email={user email}&cb={reset form url}
	 * return 
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
		var parsed_url = Url.parse(req.url, true)
			cb = parsed_url.query.cb,
			user_id = (parsed_url.pathname).replace("/d1/user/verify/", "");

		var params = {
			id : user_id,
			cb : cb
		};

		user.verifyUser(res, params);
	});

	/**
	 * login required
	 * 
	 * url schema /d1/user/{user id}/buyMembership
	 * @param req.body.stripeToken - Stripe token to be charged. If req.body.stripeCardID is specified
	 *									This value is ignored. However either req.body.stripeToken or
	 *									req.body.stripeCardID must be present.
	 * @param req.body.stripeCardID - A saved stripe card id for this user.
	 * @param req.body.saveCard - a flag on whether this card should be saved to this user's profile.
	 * @param req.body.amountAuthorized - the amount a user has authorized to be charged on their card.
	 */
	app.post('^/d1/user/[A-Za-z0-9]{24}/buyMembership', AuthToken.authorizeRequest, function(req, res) {
		var id = ((req.url).replace("/d1/user/", "")).replace("/buyMembership", ""),
			params = {
				id : id,
				stripeCardToken : req.body.stripeToken,
				stripeCardID : req.body.stripeCardID,
				saveCard : req.body.saveCard,
				amountAuthorized : req.body.amountAuthorized
			};

		user.buyMembership(res, params);
	});

};
