/*
 * Nikhil Handyal
 * 9/5/13
 * Copyright: uscscia
 * Mongoose Configuaration Module, does not define mongoose models which are located in application/models
 */

module.exports = function(){
	var mongoose = require("mongoose"),
 	dbInstance = require("./config")[global.env].db;

	mongoose.connect(dbInstance);
	var db = mongoose.connection;

	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", function callback() {
		console.log("Connected to: " + dbInstance);
	});
}




