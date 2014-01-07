/*
 * Test suite for the user controller
 */

var request = require('superagent'),
	expect = require('expect.js');


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

			done();

		});
	});

});