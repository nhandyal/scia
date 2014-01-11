var mongoose = require("mongoose"),

	// create forgot_password schema
	pwdReset_tokenSchema= mongoose.Schema(
		{
			reset_hash : 	String,
			email :			String,
		},
		{
			collection: "pwdReset_token"
		}
	);

mongoose.model("pwdReset_token", pwdReset_tokenSchema);