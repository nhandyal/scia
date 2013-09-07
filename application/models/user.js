var mongoose = require("mongoose");

// create user schema
var userSchema = mongoose.Schema(
	{
		f_name : 		String,
		l_name : 		String,
		email :			String,
		mobile : 		String,
		major : 		String,
		year : 			String,
		card_id : 		String,
		board : 		Boolean,
		created : 		Date,
		last_login : 	Date
	},
	{
		collection: "users"
	}
);

mongoose.model("user", userSchema);