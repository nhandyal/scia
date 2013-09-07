/*
 * Nikhil Handyal
 */

var env = "production",
	port = 8000,
	fs = require("fs"),
	app = require("./config/express"),
	mongoose = require("./config/mongoose")(env);


// load modules into mongoose
var models_path = __dirname + '/application/models',
	model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
    require(models_path+'/'+file);
});


require("./config/routes")(app);


app.listen(port);
console.log('Listening on port 8000');