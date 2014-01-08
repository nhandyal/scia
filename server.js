/*
 * Nikhil Handyal
 */


global.env = "test";
global.application_root = __dirname + "/application/";

require("./application/config/mongoose")();

var	transport = require("./application/config/nodemailer"),
	app = require("./application/config/express")(transport);
 

//fb = require("./application/lib/fbEventQuery");

//var time = 43200000;
//setInterval(fb.queryFacebook(),time);

app.listen(8000);
console.log('Listening on port 8000');