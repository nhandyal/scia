var user = require("../application/controllers/user");

module.exports = function(app){
	
	app.get("^/[A-Za-z]{3}[0-9]{3}|^/[0-9]{6}", function(req, res){
		// member id
		res.send("member id: "+req.url);
	});

	app.get('/d1/events*', function(req, res){
		res.send("d1 events: "+req.url);
	});

	app.get('/d1/register*', function(req, res){
		res.send("d1 register: "+req.url);
	});

	app.get('/d1/login*', function(req, res){
		res.send("d1 login: "+req.url);
	});

	app.get('/d1/logout*', function(req, res){
		res.send("d1 logout: "+req.url);
	});

}