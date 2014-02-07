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
	var model_path =  global.application_root + 'models',
		model_folders = fs.readdirSync(model_path);


	model_folders.forEach(function (model) {
	    require(model_path+"/"+model + "/lib/main.js");
	});

	console.log("mongoose models loaded")

};