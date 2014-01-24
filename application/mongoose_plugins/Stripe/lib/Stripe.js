/**
 *
 */

var Stripe = null,
	settings = require("./settings"),
	functions = require("./functions");


module.exports = exports = function StripeMongoosePlugin(schema, options) {

	if(!options.stripe_key) {
		throw new Error("A stripe key must be provided with this plugin");
	}

	Stripe = require("stripe")(options.stripe_key);

	var paths = settings.paths,
		namespace = options.namespace ? options.namespace : settings.namespace;

 	for(var path in paths) {
		
		if(options.paths) { 		
	 		if(options.paths[path]) {
	 			paths[path].path_ref = options.paths[path];
	 		}
	 	}

 		var path_ref = paths[path].path_ref,
 			path_options = paths[path].options;

 		schema.path(path_ref, path_options);

 	};

 	// attach all the plugin functions to the schema
	require("./functions").attach(schema, namespace);
	
};