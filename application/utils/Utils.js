/**
 *
 */
module.exports.loadModule = function(module_name) {
	var module_path = application_root + "modules/"+module_name+"/lib/"+module_name+".js",
		module = require(module_path);
	
	return module;
};

/**
 *
 */
module.exports.loadMongoosePlugin = function(plugin_name) {
	var plugin_path = application_root + "mongoose_plugins/"+plugin_name+"/lib/"+plugin_name+".js",
		plugin = require(plugin_path);

	return plugin;
};


/**
 *
 */
module.exports.loadMPCore = function() {
	var mpCore = require(application_root + "mongoose_plugins/mp_core.js");

	return mpCore;
}

/**
 * Assert that the input is numeric
 */
module.exports.isNumeric = function(data) {
	return (typeof data === 'number' && data%1 == 0);
}