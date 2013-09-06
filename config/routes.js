module.exports = function(app){


	app.get("/", function(req, res){
		res.render("indexMain");
	});


	app.post("/addUser", function(req, res){
		console.log(req);
		console.log(req.body.firstName);
		console.log(req.body.lastName);
		console.log(req.body.email);
		console.log(req.body.phonenumber);
		console.log(req.body.major);
		console.log(req.body.year);
		res.send("lol");

		/*
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
*/
	});
}