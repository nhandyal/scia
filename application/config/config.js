var path = require("path"),
rootPath = path.normalize(__dirname + "/..");

module.exports = {
	root : 	rootPath,
	
	production : {
		db : 	'mongodb://localhost/scia',
		app : {
			name: 'uscscia.com'
		}
	}
}