var url = require("url"),
	events = require(global.application_root + "controllers/events"),
	checkout = require(global.application_root + "controllers/checkout");
	

module.exports = function(app, transport) {
	

	app.get("/d1/testCardCommit", function(req, res){
		
	});

	app.get("/d1/testCardRet", function(req, res){
		
	});

	

	/*
	app.get("^/[A-Za-z]{3}[0-9]{3}|^/[0-9]{6}", function(req, res){
		// member id
		res.send("member id: "+req.url);
	});
	*/
	
	app.get("/d1/testEJS", function(req, res){
		res.render("email-templates/2col-1-2");
	});

	app.post('/d1/checkout*', function(req, res){
		checkout.submitPayment(req,res,transport);
	});
}
