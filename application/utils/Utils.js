var mongoose = require("mongoose");

/**
 *
 */
module.exports.AuthToken = require("./AuthToken.js");

/**
 *
 */
module.exports.loadModel = function(model_name) {
    return mongoose.model(model_name);
};

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
 *
 */
module.exports.loadController = function(controller_name) {
    var controller = require(global.application_root + "controllers/" + controller_name);

    return controller;
}


/**
 *
 */
module.exports.logError = function(err) {
    console.log(err);
    console.trace();
}

/**
 * Assert that the input is numeric
 */
module.exports.isNumeric = function(data) {
    return (typeof data === 'number' && data%1 == 0);
}