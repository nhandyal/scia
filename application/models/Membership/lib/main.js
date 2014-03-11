var mongoose = require("mongoose"),
	schema_definition = require("./def.js").schema_def,
	schema_options = require("./def.js").schema_options,
	statics = require("./statics.js");


var membership_schema = mongoose.Schema(schema_definition, schema_options);

for(static_method in statics) {
	membership_schema.statics[static_method] = statics[static_method];
}

var _model = mongoose.model("Membership", membership_schema);