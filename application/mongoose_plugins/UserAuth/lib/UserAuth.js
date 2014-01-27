/**
 *
 */


var settings = require("./settings.js");

/**
 *	options : {
 *		first_name 	: "<existing schema field first_name should map to>"
 *		last_name 	: "<existing schema field last_name should map to>"
 *		username	: "<existing schema field username should map to>"
 *		password	: "<existing schema field password should map to>"
 *	}
 *
 *	If an option field is ommited, a new field will be added in the schema.
 *	The field will be of type String, and required. In addition the username
 *	field (or what it maps to), will be enforced as unique.
 * 	
 */

 module.exports = exports = function UserAuthMongoosePlugin(schema, options) {

 	var paths = settings.paths,
 		namespace = options.namespace ? options.namespace : settings.namespace;;

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
	require("./methods").attach(schema, namespace, paths);
	
};