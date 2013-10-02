var url = require("url"),
	user = require("../controllers/user"),
	register = require("../controllers/register"),
	auth = require("../controllers/auth");

module.exports = function(app, transport, env){
	

	app.get("/d1/testCardCommit", function(req, res){
		user.commitCardId(req, res);
	});

	app.get("/d1/testCardRet", function(req, res){
		user.testcard(req, res);
	});

	app.get("^/[A-Za-z]{3}[0-9]{3}|^/[0-9]{6}", function(req, res){
		// member id
		res.send("member id: "+req.url);
	});

	app.get('/d1/events*', function(req, res){
		res.send("d1 events: "+req.url);
	});

	app.post('/d1/register*', function(req, res){
		/* expected query options
			--
			action=vrf
		*/
		var query = url.parse(req.url, true).query;
		
		if(Object.keys(query).length === 0) {
			// /d1/register
			register.stageMembership(req, res, transport);
		}
		else if(query.action == "vrf") {
			// /d1/register?action=vrf
			res.send("d1 register: "+req.url);
		}
		else{
			// doesn't match any valid route, return nothing
			res.send("");
		}

		return;
	});

	app.post('/d1/login*', function(req, res){
		// /d1/register
		auth.login(req, res, env);
	});

	app.post('/d1/logout*', function(req, res){
		auth.logout(req, res);
	});

	app.get("/d1/testEJS", function(req, res){
		res.render("email-templates/2col-1-2");
	});
}
