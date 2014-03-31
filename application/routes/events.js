/*
 * This route file handles everything under the /d1/user path
 */

var AuthToken = require(global.application_root + 'utils/authToken'),
    events = Utils.loadController("user"),
    events = require(global.application_root + "controllers/events"),
    url = require("url");

	module.exports = function (app) {

	app.get("/d1/events/:eventID", function(req, res){
		events.getEventDetails(req,res,req.params.eventID);
	});


	app.get('/d1/events*', function(req, res){
		var query = url.parse(req.url, true).query;

		events.getEvents(req,res,query);
	});
	};
