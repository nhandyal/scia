/*
 * Nikhil Handyal
 * 9/5/13
 * Copyright: uscscia
 * Express Configuaration Module
 */

var	express = require("express"),
 	config = require("./config"),
 	app = express();


app.enable('trust proxy');

// set render engine to ejs
// we are using ejs to render html emails only
app.set('views', config.root + '/application/email-blueprints');
app.set('view engine', 'ejs');

// parsing the http header contents for POST requests
app.use(express.bodyParser());

module.exports = app;