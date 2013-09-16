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

// set render engine to jade
app.set('views', config.root + '/application/views');
app.set('view engine', 'jade');
app.register('.html', require('jade'));

// parsing the http header contents for POST requests
app.use(express.bodyParser());

module.exports = app;