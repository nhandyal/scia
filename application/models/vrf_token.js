// vrf_token

var mongoose = require("mongoose"),

	// create counter schema
	vrf_tokenSchema = mongoose.Schema(
		{
			email : String,
			vrf_token : String
		},
		{
			collection : "vrf_tokens"
		}
	);

mongoose.model("vrf_token", vrf_tokenSchema);