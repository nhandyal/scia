var graph = require('fbgraph'),
	mongoose = require("mongoose"),
	user = mongoose.model("user"),
	event = mongoose.model("event");

var conf = {
    client_id:      '203560153159167'
  , client_secret:  '322350b7ffbbdbbe26fddbd0042c109a'
  , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
  , redirect_uri:   'http://localhost:3000/auth/facebook'
};


module.exports.queryFacebook = function() {
	//graph.get("", function(err,res) {
//		console.log(res);
//		graph.setAccessToken(res);
//	});
	graph.get("209821105726515?fields=events.fields(name,description,start_time,end_time,location)&access_token="+conf.client_id+"|"+conf.client_secret, function(err, res) {
	    for(var i=0;i<res.events.data.length;i++) {
		var description = res.events.data[i].description;
		var member_price = description.match(/\|\| +member.+/);
		if(member_price == null) {
			member_price = null;
		} else {
			member_price = description.match(/\d+/);
		}

		var non_member_price = description.match(/\|\| +non.+/);
		if(non_member_price == null) {
			non_member_price = null;
		} else {
			non_member_price = description.match(/\d+/);
		}

		var transportation_price = description.match(/\|\| +transportation.+/);
		if(transportation_price == null) {
			transportation_price = null;
		} else {
			transportation_price = description.match(/\d+/);
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
		}

            	eventData = {
			fb_id :                 res.events.data[i].id,
                	name :                  res.events.data[i].name,
               		start_time :            res.events.data[i].start_time,
                	location :              res.events.data[i].location,
               		description :           res.events.data[i].description,
                	member_price :          member_price,
               		non_member_price :      non_member_price,
                	transportation :        transportation_included,
                	transportation_cost :   transportation_price
       		},

		console.log(eventData);

		newEvent = new event(eventData);

        	newEvent.save(function(err, newEvent){
                	if(err) {
                        	console.log("There was an error processing the request");
                	}else {
                        	var confString = newEvent.name; 
                        	console.log(confString);
                	}
        	});
	    }
	    //console.log(res.events.data);
	});


}
