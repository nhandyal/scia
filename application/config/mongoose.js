/*
 * Nikhil Handyal
 * 9/5/13
 * Mongoose Configuaration Module. Loads all schemas located in application/schemas
 */

module.exports = function() {
    
    var fs = require("fs"),
        mongoose = require("mongoose"),
        dbInstance = require("./config")[global.env].db;

    mongoose.connect(dbInstance);
    var db = mongoose.connection;

    db.setProfiling(1, 100, function(){});
    
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function callback() {
        console.log("Connected to: " + dbInstance);
    });

    // load all the mongoose models
    var model_path =  global.application_root + 'models',
        model_folders = fs.readdirSync(model_path);


    model_folders.forEach(function (model) {
        require(model_path+"/"+model + "/lib/main.js");
    });

    /**
     * This should eventually be removed and all the db "schemas" should be transitioned to the "model" design.
     * See /application/models/User for a reference.
     */
    var schama_path =  global.application_root + 'schemas',
        schema_files = fs.readdirSync(schama_path);
    schema_files.forEach(function (file) {
            require(schama_path+'/'+file);
    });

    console.log("mongoose models loaded")

};
