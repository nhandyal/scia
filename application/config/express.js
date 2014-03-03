/*
 * Nikhil Handyal
 * 9/5/13
 *
 * Express Configuaration Module
 */

module.exports = function() {

	var	fs = require("fs"),
		express = require("express"),
	 	config = require("./config"),
	 	AuthToken = require(global.application_root + 'utils/authToken'),

	 	
	 	app = express();
 	
	var path = require('path');

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

	// use the public folder?
	app.use(express.static(path.join(__dirname, '../../public')));

	// load the routes
	var route_path =  global.application_root + 'routes',
		route_files = fs.readdirSync(route_path);


	route_files.forEach(function (file) {
	    require(route_path+'/'+file)(app);
	});
	console.log("Express routes loaded");

	app.listen(8000);
	console.log('Listening on port 8000');

	//return app;

};
