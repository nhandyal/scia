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
	collection_name = "test_users_default";


// debug flag for mongoose
//mongoose.set('debug', true);

var UserSchema = mongoose.Schema({}, {
		collection : collection_name
	});

mpCore.prime(UserSchema);
mpCore.bindPlugin("UAuth").toSchema(UserSchema).withDefaultOptions();

var User = mongoose.model('DefaultUser', UserSchema),
	UserData = {
		first_name : "Test",
		last_name : "User",
		username : "test_user@test.com",
		password : "testpwd"
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
			return done();
		});

	});
});


describe('Ensure UAuth.set writes correct values to db', function() {

	it("shodld write to the db without error", function(done) {

		var user = new User();
		
		try {
			user.invoke('UAuth.set').withArgs(UserData);
		}catch(err) {
			console.log(err);
			expect().fail("Unexpected excpetion");
			return done();
		}

		user.save(function(err, user) {

			if(err) {
				console.log(err);
				if(err.name === "ValidationError") {
					expect().fail("");
					return done();
				}
			}

			
			// we've written to the db, now query the db to ensure the write
			User.findOne({username : UserData.username}, function(err, user) {

				if(err) {
					console.log(err);
				}

				expect(user).to.exist;
				expect(user.first_name).to.be(UserData.first_name);

				done();

			});

		});

	});

	it("should write a pwd to the model without error", function(done) {
		var user = new User();

		try {
			user.invoke('UAuth.set').withArgs("password", "new_pwd");
		}catch(err) {
			console.log(err);
			expect().fail("Unexpected excpetion");
			return done();
		}

		return done();
	});

});


describe("Ensure UAuth.exists functions properly", function() {
	
	it("should return true for an entry that already exists", function(done) {
		User.invoke("UAuth.exists").withArgs(UserData.username, function(err, exists) {
			if(err) {
				console.log(err);
				expect().fail("Unexpected excpetion");
				return done();
			}

			expect(exists).to.be(true);
			done();
		});
	});

	it("should return false for an entry that doesn't exist", function(done) {
		User.invoke("UAuth.exists").withArgs("new_email@test.com", function(err, exists) {
			if(err) {
				console.log(err);
				expect().fail("Unexpected excpetion");
				return done();
			}

			expect(exists).to.be(false);
			done();
		});
	});

	it("should return false for a null entry", function(done) {
		User.invoke("UAuth.exists").withArgs(null, function(err, exists) {
			if(err) {
				console.log(err);
				expect().fail("Unexpected excpetion");
				return done();
			}

			expect(exists).to.be(false);
			done();
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