var mongoose = require("mongoose"),
    graph = require('fbgraph'),
    user = Utils.loadModel("User"),
    async = require("async"),
    event = mongoose.model("event");

var conf = {
    client_id:      '203560153159167'
  , client_secret:  '322350b7ffbbdbbe26fddbd0042c109a'
  , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
  , redirect_uri:   'http://localhost:3000/auth/facebook'
};

dbTransactionCallback = function(err, dbRes, callback, save){
                if(typeof(save)==='undefined') save = false;
                var transactionSummary = {
                        err : err,
                        dbRes : dbRes,
                        save: save
                };
                return callback(null, transactionSummary);
}

module.exports.queryFacebook = function() {
    async.parallel({
        current_events : function(callback){
                        event.find({removed: false}, function(dbErr,dbRes){
                                dbTransactionCallback(dbErr, dbRes, callback);
                        });
                },
        fb_events : function(callback){
            graph.get("209821105726515?fields=events.fields(name,description,start_time,end_time,location,cover)&access_token="+conf.client_id+"|"+conf.client_secret, function(err,res) {
                dbTransactionCallback(err, res, callback);
            });
        }
    }, function(err, results) {
        if(err || results.current_events.dbErr || results.fb_events.dbErr || typeof results.fb_events.dbRes.id == "undefined"){
                        Utils.log("Error getting events from database or from facebook"+err+results.current_events.dbErr+results.fb_events.dbErr);
                        return;
                }
        if(typeof results.fb_events.dbRes.events != "undefined") {
            for(var i=0;i<results.fb_events.dbRes.events.data.length;i++) {
                var fb_event = results.fb_events.dbRes.events.data[i];
                //This is ugly, but javascript has bad hashmaps and while it slows our server updates of events, it is not visible to the frontend, which is why the slow approach was chosen
                for(var j=0;j<results.current_events.dbRes.length;j++) {
                    if(results.current_events.dbRes[j].fb_id == fb_event.id){
                        results.current_events.dbRes.splice(j,1);
                        break;
                    }
                }
                var description = fb_event.description;
                var member_price = null;
                var non_member_price = null;
                if(typeof description != "undefined"){
                    member_price = description.match(/\|\| +member.+/i);
                    console.log(member_price);
                    console.log(typeof member_price);
                    if(member_price == null) {
                        member_price = null;
                    } else {
                        member_price = String(member_price).match(/\d+/);
                    }

                    non_member_price = description.match(/\|\| +non.+/i);
                    if(non_member_price == null) {
                        non_member_price = null;
                    } else {
                        non_member_price = String(non_member_price).match(/\d+/);
                    }
                } else {
                    description = null;
                }
                /*var transportation_price = description.match(/\|\| +(transportation|bus).+/i);
                if(transportation_price == null) {
                    transportation_price = null;
                } else {
                    transportation_price = String(transportation_price).match(/\d+/);
                }

                var transportation_included = false;

                if(transportation_price != null) {
                    if( member_price != null) {
                        member_price -= transportation_price;
                    }
                    if( non_member_price != null) {
                        non_member_price -= transportation_price;
                    }
                    var transportation_included = true;
                }*/

                var img = null;

                if(fb_event.cover != null){
                    img = fb_event.cover.source;
                }

                eventData = {
                    fb_id :                 fb_event.id,
                    name :                  fb_event.name,
                    start_time :            fb_event.start_time,
                    location :              fb_event.location,
                    description :           description,
                    member_price :          member_price,
                    non_member_price :      non_member_price,
                    event_img_url :     img,
                    removed :       false
                },

                newEvent = new event(eventData);
                newEvent = newEvent.toObject();
                delete newEvent._id;

                event.update({fb_id:newEvent.fb_id},newEvent,{upsert: true, new: true},function(err, newEvent){
                    if(err) {
                        //Utils.log("There was an error processing the request "+err);
                    } else {
                        //Utils.log("Event successfully written to database");
                    }
                });
            }
        }
        for(var i=0;i<results.current_events.dbRes.length;i++) {
            event.update({fb_id: results.current_events.dbRes[i].fb_id},{removed: true}, function(err,updatedEvent){
                if(err) {
                    Utils.log("There was an error processing the request "+err);
                                } else {
                                        Utils.log("Event successfully updated to database");
                                }
            });
        }
    });
}
