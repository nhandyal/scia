module.exports.prime = function(schema) {

	schema.methods.invoke = function(targetPath) {

		var scope = this;

		return {
			withArgs : function() {
					
				var localScope = scope,
					pathLevels = targetPath.split("."),
					targetFunction = localScope;

				
				for(var i = 0; i < pathLevels.length; i++) {
					var pathLevel = pathLevels[i];
					targetFunction = targetFunction[pathLevel];
				}

				var evalString = "targetFunction.call(localScope";
				if(arguments.length > 0) {
					for(var i = 0; i < arguments.length; i++) {
						evalString += ", arguments[" + i + "]";
					}
				}
				evalString += ")";
				
				eval(evalString);

			} 
		}
	}
};

module.exports.loadPlugin = function(schema, pluginName, pluginOptions) {

	var pluginPath = "./" + pluginName + "/lib/" + pluginName + ".js",
		plugin = require(pluginPath);


	schema.plugin(plugin, pluginOptions);
}