/*
 * Nikhil Handyal
 */


global.env = "test";
global.application_root = __dirname + "/application/";
global.Utils = require("./application/utils/Utils.js");
global.config = require("./application/config/config.js");

require("./application/config/mongoose.js")();
require("./application/config/express.js")();
 

//fb = require("./application/lib/fbEventQuery");

//var time = 43200000;
//setInterval(fb.queryFacebook(),time);