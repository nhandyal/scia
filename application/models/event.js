var mongoose = require("mongoose");

// create event schema
var eventSchema = mongoose.Schema(
	{
		fb_id : 		String,
		name : 			String,
		start_time :  		Date,
		location :		String,
		description : 		String,
		member_price :		String,
		non_member_price :	String,
		transportation :	Boolean,
		transportation_cost :	String,
		event_img_url :		String
	},
	{
		collection: "events"
	}
);

mongoose.model("event", eventSchema);
