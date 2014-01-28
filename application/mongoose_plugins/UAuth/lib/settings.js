var paths = function() {

	return {

		first_name : {
			path_ref : "first_name",
			options : {
				type 		: String,
				required 	: '{PATH} is required'
			},
			origin : "first_name"
		},

		last_name : {
			path_ref : "last_name",
			options : {
				type 		: String,
				required 	: '{PATH} is required'
			},
			origin : "last_name"
		},

		username : {
			path_ref : "username",
			options : {
				type 		: String,
				required 	: '{PATH} is required',
				unique		: true
			},
			origin : "username"
		},

		password : {
			path_ref : "password",
			options : {
				type 		: String,
				required 	: '{PATH} is required'
			},
			origin : "password"
		},

		created : {
			path_ref : "created",
			options : {
				type			: Date,
				default			: Date.now
			},
			origin : "created"
		},

		last_login : {
			path_ref : "last_login",
			options : {
				type 			: Date,
				default			: Date.now
			},
			origin : "last_login"
		}
	};

};

var exports = {
	getDefaultPaths : function() {
		return new paths();
	},
	namespace : "UAuth"
};

module.exports = exports;