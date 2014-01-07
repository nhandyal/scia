/*
 * Nikhil Handyal
 * 9/5/13
 *
 * Express Configuaration Module
 */

var	express = require("express"),
 	config = require("./config"),
 	AuthToken = require(global.application_root + 'utils/authToken'),

 	
 	app = express();
 	

app.enable('trust proxy');

// set render engine to ejs
// we are using ejs to render html emails only
app.set('views', config.root + '/views/');
app.set('view engine', 'ejs');

// parsing the http header contents for POST requests
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser("gandalf the white"));
app.use(AuthToken.parseAuthToken);

module.exports = app;