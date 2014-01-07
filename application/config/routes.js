var url = require("url"),
	auth = require("../controllers/auth"),
	events = require("../controllers/events"),
	checkout = require("../controllers/checkout");
	user = require("../controllers/user");

module.exports = function(app, transport){
	

	app.get("/d1/testCardCommit", function(req, res){
		
	});

	app.get("/d1/testCardRet", function(req, res){
		
	});


	/**
	 * User details can be queried using a user id or member id. A user id is a 24 character alphanumeric
	 * value that uniquely identifies all users in the system. A member id is a 6 character numeric value
	 * that uniquely identifies all members in the system. The user id is assigned when the user first creates
	 * their account and cannot be changed. However the member id can be changed is the user loses their member card.
	 */
	app.get("^/d1/[A-Za-z0-9]{24}|^/d1/[0-9]{6}", function(req, res) {
		res.send("FINISH THIS");
	});

	/*
	app.get("^/[A-Za-z]{3}[0-9]{3}|^/[0-9]{6}", function(req, res){
		// member id
		res.send("member id: "+req.url);
	});
	*/

	app.get('/d1/events*', function(req, res){
		var query = url.parse(req.url, true).query;
		if(query.eventID) {
			events.getEventDetails(req,res,query);
		}
		else {
			events.getEvents(req,res,query);
		}
	});

	/****** USER ******/
	//app.get('/d1/user/*',)

	app.post('/d1/user/create', function(req, res) {
		user.create(req, res, transport);
	});

	app.get('^/d1/user/verify/[A-Za-z0-9]{24}', function(req, res) {
		user.verifyUser(req, res);
	});

	app.post('d1/user/resendVerificationEmail', function(req, res) {
		user.resendVerificationEmail(req, res, transport);
	});
	
	app.post('/d1/login*', function(req, res){
		// /d1/register
		auth.login(req, res);
	});

	app.post('/d1/logout*', function(req, res){
		auth.logout(req, res);
	});

	app.get("/d1/testEJS", function(req, res){
		res.render("email-templates/2col-1-2");
	});

	app.post('/d1/checkout*', function(req, res){
		checkout.submitPayment(req,res,transport);
	});

	app.get('/d1/test', function(req, res){
		user.test(req, res);
	});
}
