/*
 * Nikhil Handyal
 * 1/6/13
 * 
 * Test suite for the UAuth Mongoose plugin
 */

var mongoose = require('mongoose'),
	request = require('superagent'),
	expect = require('expect.js'),
	mpCore = require('./../../mp_core.js'),
	collection_name = "test_users_custom";

var UserSchema = mongoose.Schema({}, {
		collection : collection_name
	});

var SchemaOptions = {
	paths : {
		first_name : "f_name",
		last_name : "l_name",
		password : "pwd"
	},
	namespace : "UserAuth"
};

mpCore.prime(UserSchema);
mpCore.bindPlugin("UAuth").toSchema(UserSchema).withOptions(SchemaOptions);

var	User = mongoose.model('CustomUser', UserSchema),

	UserData = {
		f_name : "Test2",
		l_name : "User2",
		username : "test2_user2@lollerx.com",
		pwd : "testpwd2"
	};


describe('Connect to the test database', function() {
	it('should connect without an error', function(done) {

		if(mongoose.connection.readyState == 1) {
			// a connection already exists
			return done();
		}

		mongoose.connect("mongodb://localhost/test");
		var db = mongoose.connection;

		db.on("error", console.error.bind(console, "connection error:"));
		db.once("open", function callback() {
			done();
		});

	});
});



describe('Ensure custom field mappings work', function() {

	it("should write to the db with the custom mappings", function(done) {

		var user = new User();

		try {
			user.invoke('UserAuth.set').withArgs(UserData);
		}catch(err) {
			console.log(err);
			console.trace();
			expect.fail("Unexpected excpetion caught");
			return done();
		}
		
		user.save(function(err, user) {

			if(err) {
				//console.log(err);
				if(err.name === "ValidationError") {
					expect().fail();
					return done();
				}
			}

			
			// we've written to the db, now query the db to ensure the write
			// with the custom data we did not overwrite the username field, so we
			// expect to be able to query by the username field
			User.findOne({username : UserData.username}, function(err, user) {

				if(err) {
					console.log(err);
				}

				expect(user).to.exist;

				// first_name has been overwriten by f_name, ensure this overwrite 
				// is reflected in the database document
				expect(user.f_name).to.be(UserData.f_name);

				done();

			});

		});

	});

});

after(function(done) {
	
	// lets clean up after ourselves
	mongoose.connection.collections[collection_name].drop( function(err) {
		if(err) {
			console.log(err);
			return done();
		}

		console.log("");
    	console.log('collection: ' + collection_name + ' dropped');
    	done();
	});

});