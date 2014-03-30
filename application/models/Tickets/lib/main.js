var mongoose = require("mongoose"),
    schema_definition = require("./def.js").schema_def,
    schema_options = require("./def.js").schema_options,
    model_name = require("./def.js").model_name,
    statics = require("./statics.js");




var ticket_schema = mongoose.Schema(schema_definition, schema_options);

for(static_method in statics) {
    ticket_schema.statics[static_method] = statics[static_method];
}

var _model = mongoose.model(model_name, ticket_schema);