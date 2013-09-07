var mongoose = require("mongoose");

// create counter schema
var counterSchema = mongoose.Schema(
	{
		count : Number
	},
	{
		collection : "counter"
	}
);

mongoose.model("counter", counterSchema);