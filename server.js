/*
 * Nikhil Handyal
 */
 
var env = "production",
	port = 8000,
	fs = require("fs"),
	express = require("express"),
	app = require("./application/config/express"),
	mongoose = require("./application/config/mongoose")(env),
	transport = require("./application/config/nodemailer");


// load modules into mongoose
var models_path = __dirname + '/application/models',
	model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
    require(models_path+'/'+file);
});


app.use(express.cookieParser("Secret")); //Need to update the cookie parser to use a secret key, but for now this works
require("./application/config/routes")(app, transport);

app.listen(port);
console.log('Listening on port 8000');

