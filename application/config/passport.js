/**
 * Author : Nikhil Handyal
 * Date : 12/29/2013
 * Description: passport configuration model
 */

var passport = require('passport'),
 	LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
	function(email, password, done) {
		User.findOne({ email: email }, function (err, user) {
			
		});
	}
));