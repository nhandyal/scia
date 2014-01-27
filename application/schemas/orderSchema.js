var mongoose = require("mongoose"),
	ORDER_STATUS = {
		PENDING : "PENDING",
		SHIPPED : "SHIPPED"
	};


// create user schema
var orderSchema = mongoose.Schema(
	{

		// required elements
		customer_id 		: {
			type 				: String,
			required			: '{PATH} is required'
		},

		created 			: {
			type 				: Date,
			default				: Date.now
		},

		merchandise_id		: {
			type				: String,
			required			: '{PATH} is required'
		},

		description			: {
			type 				: String,
			required			: '{PATH} is required'
		},

		status 				: {
			type 				: String,
			default 			: ORDER_STATUS.PENDING
		},

		grand_total			: {
			type				: Number,
			required			: '{PATH} is required'
		},

		quantity			: {
			type				: Number,
			required			: '{PATH} is required'
		}
	},

	{
		collection: "orders"
	}
);

mongoose.model("order", orderSchema);