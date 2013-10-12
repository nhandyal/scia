var url = require("url"),
	register = require("../controllers/register"),
	auth = require("../controllers/auth"),
	events = require("../controllers/events");

module.exports = function(app, transport){
	

	app.get("/d1/testCardCommit", function(req, res){
		
	});

	app.get("/d1/testCardRet", function(req, res){
		
	});

	app.get("^/[A-Za-z]{3}[0-9]{3}|^/[0-9]{6}", function(req, res){
		// member id
		res.send("member id: "+req.url);
	});

	app.get('/d1/events*', function(req, res){
		var query = url.parse(req.url, true).query;
		if(query.eventID) {
			events.getEventDetails(req,res,query);
		}
		else {
			events.getEvents(req,res,query);
		}
	});

	app.post('/d1/register*', function(req, res){
		/* expected query options
			--
			action=vrf
			action=resendVrf
		*/
		var query = url.parse(req.url, true).query;
		
		if(Object.keys(query).length === 0) {
			// /d1/register
			register.create(req, res, transport);
		}
		else if(query.action == "vrf") {
			// /d1/register?action=vrf
			register.verify(req, res);
		}
		else if(query.action == "resendVrf") {
			// /d1/register?action=resendVrf
			register.resendVerificationEmail(req, res, transport);
		}
		else{
			// doesn't match any valid route, return nothing
			res.send("");
		}

		return;
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
}
