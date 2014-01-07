/*
 * Nikhil Handyal
 */


/* Init sequence
 * 1. Mongoose
 * 3. Utils
 		- Nodemailer
 		- FB Support
 * 4. Express
 * 5. Epress routes
 */




global.env = "test";
global.application_root = __dirname + "/application/";

require("./application/config/mongoose")();

var port = 8000,
	transport = require("./application/config/nodemailer"),
	app = require("./application/config/express");
 



require("./application/config/routes")(app, transport);

//fb = require("./application/lib/fbEventQuery");

//var time = 43200000;
//setInterval(fb.queryFacebook(),time);

app.listen(port);
console.log('Listening on port 8000');