/**
 *
 */

var Stripe = null,
	settings = require("./settings");


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
	 			var mappedPath_ref = options.paths[path];
	 			paths[path].path_ref = mappedPath_ref;
	 			paths[mappedPath_ref] = paths[path];
	 			paths[mappedPath_ref].origin = path;
	 		}
	 	}

 		var path_ref = paths[path].path_ref,
 			path_options = paths[path].options;

 		schema.path(path_ref, path_options);

 	};

 	// attach all the plugin functions to the schema
	require("./methods").attach(schema, namespace, paths, Stripe);
	
};