/*
 * Schema that defines the current membership price
 */

var mongoose = require("mongoose");

// create membership schema
var membershipSchema = mongoose.Schema(
	{
		current_price 				: {
			type				: Number,
			required			: '{PATH} is required'
		},

		updated						: Date
	},

	{
		collection: "membership"
	}
);

mongoose.model("membership", membershipSchema);