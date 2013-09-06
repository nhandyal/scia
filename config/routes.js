module.exports = function(app){

	app.get("/", function(req, res){
		res.render("index");
	});

	app.get("/addUser", function(req, res){
		var name = req.query.user,
						email = req.query.email;

		var user = new users({
						name: name,
						email: email
		});

		user.save(function(err, result){
						if(err){
										res.send("something bad happend");
						}
						else{
										res.send("saved new user");
						}
		});
	});
}