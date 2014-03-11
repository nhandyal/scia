var mongoose = require("mongoose"),
    schema_definition = require("./def.js").schema_def,
    schema_options = require("./def.js").schema_options,
    statics = require("./statics.js"),
    methods = require("./methods.js"),
    mpCore = Utils.loadMPCore(),

    user_auth_options = {
        paths : {
            first_name : "f_name",
            last_name : "l_name",
            username : "email",
            password : "pwd"
        }
    },

    stripe_options = {
        stripe_key : config[env].stripe_key
    };

var user_schema = mongoose.Schema(schema_definition, schema_options);

mpCore.prime(user_schema);
mpCore.bindPlugin("UAuth").toSchema(user_schema).withOptions(user_auth_options);
mpCore.bindPlugin("Stripe").toSchema(user_schema).withOptions(stripe_options);


for(static_method in statics) {
    user_schema.statics[static_method] = statics[static_method];
}

for(instance_method in methods) {
    user_schema.methods[instance_method] = methods[instance_method];
}

var _model = mongoose.model("User", user_schema);