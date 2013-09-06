var path = require("path"),
rootPath = path.normalize(__dirname + "/..");

console.log(rootPath);

module.exports = {
	production : {
		db : 	'mongodb://localhost/scia',
		root : 	rootPath,
		app : {
			name: 'uscscia.com'
		}
	}
}