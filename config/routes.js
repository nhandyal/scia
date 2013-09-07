var user = require("../application/controllers/user");

module.exports = function(app){


	app.get("/*", function(req, res){
		function isNumber(n) {
		  	return !isNaN(parseFloat(n)) && isFinite(n);
		}

		var path = (req.url).split("/");
		if(path[0]=="" && path[1] == ""){
			res.render("index")
		}
		else if( isNumber(path[1]) ) {
			user.queryUser(req, res, path[1]);
		} else {
			res.redirect(301, 'https://www.uscscia.com');
		}
	});


	app.post("/addUser", function(req, res){
		user.create(req, res);
	});
}