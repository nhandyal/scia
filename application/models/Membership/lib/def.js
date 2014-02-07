module.exports.schema_def = {
	price : {
		type : Number,
		required : "{PATH} is required"
	},

	created : {
		type : Date,
		default : Date.now
	}
};

module.exports.schema_options = {
	collection : "membership"
};