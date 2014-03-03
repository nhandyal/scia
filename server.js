/*
 * Nikhil Handyal
 */


global.env = "test";
global.application_root = __dirname + "/application/";
global.Utils = require("./application/utils/Utils.js");
global.config = require("./application/config/config.js");

require("./application/config/mongoose.js")();
require("./application/config/express.js")();
 

var fb = require("./application/lib/fbEventQuery");

//var time = 300000;//Update the events every 5 minutes
var time = 10000; //update every 10 seconds for demo
setInterval(function(){
	fb.queryFacebook();
},time);
