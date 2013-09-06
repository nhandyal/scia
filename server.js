/*
 * Nikhil Handyal
 */

var express = 	require("express"),
	mongoose = require("mongoose"),
	jade = require("jade"),
	app = express(),
	env = "production",
	config = require("./config/config");


mongoose.connect(config.db);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
	console.log("Connected to: " + dbInstance);
});


// Define Mongoose Schemas
var userSchema = mongoose.Schema({
		name: String,
		email: String
	}, {
		collection: "users"
});

var users = mongoose.model("users", userSchema);


// Express
app.enable('trust proxy');

app.get("/", function(req, res){
				
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

app.listen(8000);
console.log('Listening on port 8000');