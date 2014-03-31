
var mongoose = require("mongoose"),
    event = mongoose.model("event"),
    async = require("async"),
    EventTicket = Utils.loadModel("Tickets"),
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

	//event.find({start_time: {$gt: start}}, null, {sort: {start_time: 1}},function(dbErr, dbRes){
	event.find({}, null, {sort: {start_time: 1}},function(dbErr, dbRes){
		if(dbErr){
			ResponseHandler.log("Error finding the events" +err);
			return ResponseHandler.sendError(res,10050);
		}
				 
		var numberToReturn = dbRes.length;
		if(count > 0){
		    numberToReturn = count;
		}
			 
		var response = [];

		for(var i=0;i<numberToReturn;i++) {
		    var entry = dbRes[i].toObject();
		    if(entry.removed){ 
			continue; 
		    }
		
		    entry.id = entry._id;

		    delete entry.fb_id;
		    delete entry._id;
		    delete entry.member_price;
		    delete entry.non_member_price;
		    delete entry.removed;
		    
		     
		    response.push(entry);
		}
			 
		return ResponseHandler.sendSuccess(res, response);
	});
}

module.exports.getEventDetails = function(req,res,eventID) {
	var event_id = eventID;

	if(req.loggedIn) {
	    async.parallel({
		    events: function(callback){
			     event.find({_id: event_id}, null, {sort: {start_time: 1}},function(dbErr,dbRes){
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
			    console.log("Error finding the events or the tickets" +err);
			    return ResponseHandler.sendError(res,10050);
		    }
				     
		    var entry = results.events.dbRes[0].toObject();
		    
		    entry.bought_ticket = false;
		    entry.ticket_total = 0;
			
		    if(results.tickets.dbRes.length != "undefined"){
		    //can't find javascript hashes that are good, using brute force searches until I do
			for(var i=0;i<results.tickets.dbRes.length;i++){
			    if(results.tickets.dbRes[i].event_id == entry.fb_id){
				    entry.bought_ticket = true; //should remove the found tickets from the list, but that can be added later
				    entry.ticket_total += results.dbRes[i].number_of_tickets;
			    }
			}
		    }

		    entry.id = entry._id;
		    delete entry._id;

		    return ResponseHandler.sendSuccess(res, entry);
	    });
	} else {
		event.find({_id: event_id}, null, {sort: {start_time: 1}},function(dbErr,dbRes){
		    
		    if(dbErr) {
			return ResponseHandler.processError(res, dbErr);
		    }
		    if(dbRes.name == "undefined"){
		    	return ResponseHandler.sendError(res,10050);
		    }

		    var entry = dbRes[0].toObject();

		    entry.id = entry._id;
                    delete entry._id;

		    return ResponseHandler.sendSuccess(res, entry);
		}); 
	}
}
