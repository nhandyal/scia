/*
 * Nikhil Handyal
 */


global.env = "test";
global.application_root = __dirname + "/application/";
global.transport = require("./application/config/nodemailer");

require("./application/config/mongoose")();
require("./application/config/express")();
 

//fb = require("./application/lib/fbEventQuery");

//var time = 43200000;
//setInterval(fb.queryFacebook(),time);