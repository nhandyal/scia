var mongoose = require("mongoose");

// create user schema
var userSchema = mongoose.Schema(
	{
		name: String,
		email: String,
	},
	{
		collection: "users"
	}
);

mongoose.model("users", userSchema);