
var mongoose = require("mongoose"),
    event = mongoose.model("event"),
    async = require("async"),
    ResponseHandler = Utils.loadModule("ResponseHandler");


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

    if(req.loggedIn) {
	async.parallel({
                events: function(callback){
			 event.find({start_time: {$gt: start}}, null, {sort: {start_time: 1}},function(dbErr,dbRes){
                                dbTransactionCallback(dbErr, dbRes, callback);
                        });
                },
                tickets: function(callback){
                        EventTicket.find({member_id: req.id}, function(dbErr,dbRes){
                                dbTransactionCallback(dbErr, dbRes, callback);
                        });
                }
        }, function(err, results){
                if(err || results.events.dbErr || results.tickets.dbErr){
                        utils.log("Error finding the events or the tickets" +err);
                        utils.sendError(res,10050);
                }
       			         
		var numberToReturn = results.user.dbRes.length;
		if(count > 0){
		    numberToReturn = count;
		}
			 
		var response = [];

		for(var i=0;i<numberToReturn;i++) {
		    var entry = results.events.dbRes[i].toObject();
		    if(entry.removed){ 
			continue; 
		    }
		
		    entry.bought_ticket = false;
		    
		    if(results.tickets.dbRes.length != "undefined"){
		    //can't find javascript hashes that are good, using brute force searches until I do
		    for(var i=0;i<results.tickets.dbRes.length;i++){
			if(results.tickets.dbRes[i].event_id == entry.fb_id){
				entry.bought_ticket = true; //should remove the found tickets from the list, but that can be added later
				break;
			}
		    }

		    //entry.id = entry.fb_id;

		    //delete entry.fb_id;
		    //delete entry._id;
		     
		    response.push(entry);
		}
			 
		return ResponseHandler.sendSuccess(res, response);
		}
	});
    } else {
	    event.find({start_time: {$gt: start}}, null, {sort: {start_time: 1}},function(dbErr,dbRes){
		
		if(dbErr) {
		    return ResponseHandler.processError(res, err);
		}

		var numberToReturn = dbRes.length;
		if(count > 0){
		    numberToReturn = count;
		}
		
		var response = [];

		for(var i=0;i<numberToReturn;i++) {
		    var entry = dbRes[i].toObject();
		    console.log(entry);
		    if(entry.removed){ 
			continue; 
		    }

		    //entry.id = entry.fb_id;

		    //delete entry.fb_id;
		    //delete entry._id;
		    
		    response.push(entry);
		}
		
		return ResponseHandler.sendSuccess(res, response);
	    }); 
    }
}

module.exports.getEventDetails = function(req,res,query) {
    var event_id = query.eventID;

    event.find({fb_id: event_id}, function(dbErr,dbRes){
        
        if(dbErr) {
            return ResponseHandler.processError(res, err);
        }
	
	if(dbRes.length<=0){
		return ResponseHandler.sendError(res, "500"); //Add event isnt in the db error later
	}

        var response = dbRes[0];
        //response.id = response.fb_id;

        //delete response._id;
        //delete response.fb_id;

        return ResponseHandler.sendSuccess(res, responseData);
    });
}
