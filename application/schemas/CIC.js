// CIC : CardIDCounter

var mongoose = require("mongoose"),

	// create counter schema
	CICSchema = mongoose.Schema(
		{
			CICIndex : Number
		},
		{
			collection : "CIC"
		}
	);

mongoose.model("CIC", CICSchema);