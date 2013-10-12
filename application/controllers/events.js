
var mongoose = require("mongoose"),
	event = mongoose.model("event"),
	VRF = mongoose.model("vrf_token"),
	CIC = mongoose.model("CIC"),
	crypto = require("crypto"),
	async = require("async"),
	utils = require("./utils"),
	auth = require("./auth");


module.exports.getEvents = function(req,res,query) {
	var start = new Date();
	var end = new Date(start.getFullYear()+1);
	var count = -1;

	if(req.start){
		start = req.start;
	}
	if(req.end) {
		end = req.end;
	}
	if(req.count) {
		count = req.count;
	}
	
	var events = event.find({start_time: {$gt: start}}, null, {sort: {start_time: 1}},function(dbErr,dbRes){
		if(dbErr){
			utils.sendError(res,10500);
		}
		var numberToReturn = dbRes.length;
		if(count > 0){
			numberToReturn = count;
		}
		
		var response = [];

		for(var i=0;i<numberToReturn;i++) {
			var entry = dbRes[i].toObject();
			delete entry._id;
			entry.id = entry.fb_id;
			delete entry.fb_id;
			response.push(entry);
		}
		utils.sendResponse(res,response);
	}); 
}

module.exports.getEventDetails = function(req,res,query) {
	var event_id = query.eventID;

	var event = event.find({fb_id: event_id}, function(dbErr,dbRes){
		if(dbErr){
                        utils.sendError(res,10500);
                }

                var response = dbRes[i].toObject();
                delete entry._id;
                entry.id = entry.fb_id;
                delete entry.fb_id;
                response.push(entry);

                utils.sendResponse(res,response);
	});
}
