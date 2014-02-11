/*
 * Nikhil Handyal
 * 1/6/13
 * 
 * Test suite for the user controller
 */



var request = require('superagent'),
	expect = require('expect.js'),
	Utils = require(__dirname + "/utils/utils"),

	test_user = {
		f_name : "Test",
		l_name : "User",
		email : "nhandyal@gmail.com",
		pwd : "test_password"
	};

describe('Create a new user', function() {

	this.timeout(5000);

	it("should return status 0", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/create')
		.send("f_name=" + test_user.f_name)
		.send("l_name=" + test_user.l_name)
		.send("email=" + test_user.email)
		.send("pwd=" + test_user.pwd)
		.end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(0);
			expect(res.body.data.id).to.exist;

			test_user.id = res.body.data.id;

			done();

		});
	});

});


describe('Create a user with a duplicate email', function() {
	
	it("should return status 10001", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/create')
		.send("f_name=" + test_user.f_name)
		.send("l_name=" + test_user.l_name)
		.send("email=" + test_user.email)
		.send("pwd=" + test_user.pwd)
		.end(function(res){

			expect(res).to.exist;
			expect(res.body.status).to.be(10001);
			
			done();
		});

	});
});


describe('Create a user with an invalid password', function() {
	it("should return status 10400", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/create')
		.send("f_name=" + test_user.f_name)
		.send("l_name=" + test_user.l_name)
		.send("email=" + test_user.email)
		.send("pwd=")
		.end(function(res){

			expect(res).to.exist;
			expect(res.body.status).to.be(10400);
			
			done();

		});
	})
});


describe('Verify a user with an invlid vrf_link', function() {
	
	it("should return a status 10402", function(done) {
		request.get('http://127.0.0.1:8000/d1/user/verify/52cb919cj37151770e000001').end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(10402);
			
			done();

		});
	});
});


describe("login a user with an UNVERIFIED account", function() {

	it("should return a status 10051", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/login')
		.send("email=" + test_user.email)
		.send("pwd=" + test_user.pwd)
		.end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(10051);
			
			done();

		});
	});
});


describe('Verify a user with a valid vrf_link', function() {

	it("should return a status 0", function(done) {
		request.get('http://127.0.0.1:8000/d1/user/verify/' + test_user.id).end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(0);
			
			done();

		});
	});
});


describe("login a user with a VERIFIED account", function() {

	it("should return a status 10050 with a wrong pwd", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/login')
		.send("email=" + test_user.email)
		.send("pwd=wrong_pwd")
		.end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(10050);

			
			done();

		});
	});

	it("should return a status 0 with the right pwd and an auth token", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/login')
		.send("email=" + test_user.email)
		.send("pwd=" + test_user.pwd)
		.end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(0);
			var cookies = Utils.parseCookie(res.headers['set-cookie']);

			expect(cookies.sid.value == test_user.id);
			
			done();

		});
	});
});

describe("Reset a user password", function() {

	var reset_token = null;

	describe("Request a recover link", function() {
		it("should return a status 0 with the reset token", function(done) {
			request.get("http://127.0.0.1:8000/d1/user/recover")
			.query({
				email : test_user.email,
				cb : "http://www.google.com"
			})
			.end(function(res) {

				expect(res.body.status).to.be(0);
				expect(res.body.data.token).to.be.a('number');

				reset_token = res.body.data.token;


				done();

			});
		});
	});

	describe("Set a new password using a broken recover token", function() {
		it("should return a status of 10052", function(done) {
			request.post("http://127.0.0.1:8000/d1/user/reset")
			.type("form")
			.send({
				id : test_user.id,
				token : Date.now(),
				new_pwd : "broken_pwd"
			})
			.end(function(res) {

				expect(res.body.status).to.be(10052);

				done();
			});
		});
	});

	test_user.pwd = "new_pwd";

	describe("Set a new password using a valid recover token", function() {
		it("should return a status of 0", function(done) {
			request.post("http://127.0.0.1:8000/d1/user/reset")
			.type("form")
			.send({
				id : test_user.id,
				token : reset_token,
				new_pwd : test_user.pwd
			})
			.end(function(res) {

				expect(res.body.status).to.be(0);

				done();
			});
		});
	});



	describe("Login with a new password", function() {
		it("should return a status 0 and an auth token", function(done) {
		request.post('http://127.0.0.1:8000/d1/user/login')
		.type("form")
		.send({
			email : test_user.email,
			pwd : test_user.pwd
		})
		.end(function(res) {

			expect(res).to.exist;
			expect(res.body.status).to.be(0);
			var cookies = Utils.parseCookie(res.headers['set-cookie']);

			expect(cookies.sid.value == test_user.id);
						
			done();

		});
	});
	});
});
