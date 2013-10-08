/*
 * Nikhil Handyal
 */

global.env = "test";
 
var port = 8000,
	fs = require("fs"),
	app = require("./application/config/express"),
	mongoose = require("./application/config/mongoose")(),
	transport = require("./application/config/nodemailer");


// load modules into mongoose
var models_path = __dirname + '/application/models',
	model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
    require(models_path+'/'+file);
});


require("./application/config/routes")(app, transport);


app.listen(port);
console.log('Listening on port 8000');