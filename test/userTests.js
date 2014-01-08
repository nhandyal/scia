/*
 * Nikhil Handyal
 * 1/6/13
 * 
 * Test suite for the user controller
 */

var request = require('superagent'),
	expect = require('expect.js'),
	userID = "";


describe('Create a new user', function() {
	it("should return status 0", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/create')
		.send("f_name=Nikhil")
		.send("l_name=Handyal")
		.send("email=nhandyal@gmail.com")
		.send("pwd=abcdefg")
		.end(function(res){

			expect(res).to.exist;
			expect(res.body.status).to.be(0);
			expect(res.body.data.id).to.exist;

			userID = res.body.data.id;

			done();

		});
	});
});

describe('Create a user with a duplicate email', function() {
	it("should return status 10001", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/create')
		.send("f_name=Nikhil")
		.send("l_name=Handyal")
		.send("email=nhandyal@gmail.com")
		.send("pwd=abcdefg")
		.end(function(res){

			expect(res).to.exist;
			expect(res.body.status).to.be(10001);
			
			done();

		});
	})
});

describe('Create a user with an invalid password', function() {
	it("should return status 10400", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/create')
		.send("f_name=Nikhil")
		.send("l_name=Handyal")
		.send("email=nhandyal@gmail.com")
		.send("pwd=")
		.end(function(res){

			expect(res).to.exist;
			expect(res.body.status).to.be(10400);
			
			done();

		});
	})
});

describe('Attempt to verify a user ', function() {
	
	it("with an invalid vrf_link should return status 10402", function(done) {
		request.get('http://127.0.0.1:8000/d1/user/verify/52cb919cj37151770e000001').end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(10402);
			
			done();

		});
	});

	it("with a valid vrf_link should return status 0", function(done) {
		request.get('http://127.0.0.1:8000/d1/user/verify/'+userID).end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(10402);
			
			done();

		});
	});

});