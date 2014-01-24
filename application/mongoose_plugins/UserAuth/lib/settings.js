var paths = {

	first_name : {
		path_ref : "first_name",
		options : {
			type 		: String,
			required 	: '{PATH} is required'
		}
	},

	last_name : {
		path_ref : "last_name",
		options : {
			type 		: String,
			required 	: '{PATH} is required'
		}
	},

	username : {
		path_ref : "username",
		options : {
			type 		: String,
			required 	: '{PATH} is required',
			unique		: true
		}
	},

	password : {
		path_ref : "password",
		options : {
			type 		: String,
			required 	: '{PATH} is required'
		}
	},

	created : {
		path_ref : "created",
		options : {
			type			: Date,
			default			: Date.now
		}
	},

	last_login : {
		path_ref : "last_login",
		options : {
			type 			: Date,
			default			: Date.now
		}
	}

};

var exports = {
	paths : paths,
	namespace : "UserAuth"
};

module.exports = exports;