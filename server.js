/*
 * Nikhil Handyal
 */

var env = "production",
	port = 8000;
	app = require("./config/express"),
	mongoose = require("./config/mongoose")(env);


require("./config/routes")(app);

app.listen(port);
console.log('Listening on port 8000');