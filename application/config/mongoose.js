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

	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", function callback() {
		console.log("Connected to: " + dbInstance);
	});

	// load all the mongoose schemas
	var schama_path =  application_root + 'schemas',
		schema_files = fs.readdirSync(schama_path);


	schema_files.forEach(function (file) {
	    require(schama_path+'/'+file);
	});
	
	console.log("mongoose schemas loaded")

}