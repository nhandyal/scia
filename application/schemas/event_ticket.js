var mongoose = require("mongoose");

// create event ticket schema
// We will use the id of the ticket in the database to find it
var eventTicketSchema = mongoose.Schema(
	{
		f_name : 		String,
		l_name :		String,
		email :			String,
		card_id :		String,	
		event_id :		String,
		transportation :	Boolean
	},
	{
		collection: "event_tickets"
	}
);

mongoose.model("event_ticket", eventTicketSchema);
