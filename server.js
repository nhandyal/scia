/*
 * Nikhil Handyal
 */
 
var env = "production",
	port = 8000,
	fs = require("fs"),
	app = require("./application/config/express"),
	mongoose = require("./application/config/mongoose")(env),
	transport = require("./application/config/nodemailer");


// load modules into mongoose
var models_path = __dirname + '/application/models',
	model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
    require(models_path+'/'+file);
});


require("./application/config/routes")(app, transport);

fb = require("./application/lib/fbEventQuery");

var time = 43200000;
setInterval(fb.queryFacebook(),time);

app.listen(port);
console.log('Listening on port 8000');

