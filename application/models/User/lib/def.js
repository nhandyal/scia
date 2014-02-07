module.exports.schema_def = {
	// required elements
	member_id 			: {
		type				: Number,
		default				: 000000
	},
	
	is_verified 		: {
		type				: Boolean,
		default				: false
	},
	
	is_member 			: {
		type				: Boolean,
		default				: false
	},

	is_board 			: {
		type				: Boolean,
		default				: false
	},


	// profile elements
	major 				: {
		type				: String,
		default				: "n/a"
	},
	
	year 				: {
		type				: String,
		default				: "n/a"
	},
	
	
	// mobile elements
	mobile_number 		: {
		type				: Number,
		default				: "0000000000"
	},

	text_notify			: {
		type				: Boolean,
		default				: false
	},

	carrier  			: {
		type				: String,
		default				: "n/a"
	},

	is_phone_verified 	: {
		type				: Boolean,
		default				: false
	},

	// password reset elements
	pwd_reset_token			: Number,
};


module.exports.schema_options = {
	collection: "users"
};