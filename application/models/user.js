var mongoose = require("mongoose");

// create user schema
var userSchema = mongoose.Schema(
	{
		f_name : 		String,
		l_name : 		String,
		pwd :  			String,
		email :			String,
		mobile : 		String,
		text_notify : 	Boolean,
		carrier : 		String,
		carrier_code : 	String,
		vrf_phone : 	Boolean,
		major : 		String,
		year : 			String,
		card_id : 		String,
		member : 		Boolean,
		board_id : 		String,
		board : 		Boolean,
		verified : 		Boolean,
		created : 		Date,
		last_login : 	Date,
	},
	{
		collection: "users"
	}
);

mongoose.model("user", userSchema);