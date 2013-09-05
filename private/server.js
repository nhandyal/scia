/*
 * Nikhil Handyal
 */

var express = require("express"),
				mongoose = require("mongoose"),
				jade = require("jade"),
				app = express();
				
// Connect to MongoDB via Mongoose
var dbInstance = "mongodb://localhost/scia";
mongoose.connect(dbInstance);
console.log("Connection pending to: " + dbInstance);

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
app.use(express.static(__dirname + '../public'));
app.enable('trust proxy');

/*
app.all("*", function(req, res){
				console.log(req.url);
				res.send('Hello World');
});
*/

app.get("/", function(req, res){
				res.render("index.html");
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