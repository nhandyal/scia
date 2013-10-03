var mongoose = require("mongoose"),
	user = mongoose.model("user"),
	crypto = require("crypto"),

	authTokenKeys = ["f_name", "l_name", "board", "card_id", "vrf", "ssid", "sb", "scid", "sem", "svrf"],

	clientOptions = {
		httpOnly : false,
		secure : false
	},

	serverOptions = {
		httpOnly : true,
		secure : (global.env == "test" ? false : true)
	},

	authToken = function(userDbObject){

		/* 
		 * Client Accesible Values
		 *
		 * These values are provided to allow client services to populate fields as nescessary.
		 * They are insecure httpOnly false cookies and are meant to be read-only.
		 */

		this.f_name = {
			value : userDbObject.f_name,
			options : clientOptions
		};
		
		this.l_name = {
			value : userDbObject.l_name,
			options : clientOptions
		};

		this.board = {
			value : userDbObject.board,
			options : clientOptions
		};

		this.card_id = {
			value : userDbObject.card_id,
			options : clientOptions
		};

		this.vrf = {
			value : userDbObject.verified,
			options : clientOptions
		};

		/*
		 * Server Accesible Values 
		 *
		 * Some of the server specific values are duplicates of client facing values.
		 * However since the client facing values can be altered, they are to be treated as read_only values.
		 * For all validations and db-transactions, server processes will be using the server facing values.
		 *
		 * All Server cookies must start with a lowercase 's'
		 */

		// server sesion id
		this.ssid = {
			value : "scA98DB973KWL8XP1LZ94KJF0BM",
			options : serverOptions
		};

		// server board flag
		this.sb = {
			value : userDbObject.board,
			options : serverOptions	
		};

		// server card_id
		this.scid = {
			value : userDbObject.card_id,
			options : serverOptions
		};

		// server email
		this.sem = {
			value : userDbObject.email,
			options : serverOptions
		};

		// server vrf flag
		this.svrf = {
			value : userDbObject.verified,
			options : serverOptions
		};

		return this;
	};


module.exports.updateAuthToken = function(res, key, value){
	
	if(authTokenKeys.indexOf(key) < 0)
		return false;

	if(key.charAt(0) == 's'){
		// this is a server cookie
		res.cookie(key, value, serverOptions);	
	}
	else{
		// this is a general cookie
		res.cookie(key, value, clientOptions);	
	}

	return true;
};

module.exports.login = function(req, res, env){

	user.find({email : req.body.email}, function(dbErr, dbRes){
		if(dbErr){
			res.redirect(301, 'https://www.uscscia.com');
		}
		else{
			//try{
				//here is how to access a cookie: 
				//console.log(req.cookies.l_name);
			//} catch (err) {
				//console.log(err);
			//}

			try{
				var md5 = crypto.createHash("md5");
				var pwd_hash = md5.update(req.body.pwd).digest("hex");
				for(var i=0;i<dbRes.length;i++) {
					var newUser = dbRes[i];
					if(pwd_hash == newUser.pwd) {
						var userAuthToken = new authToken(newUser, env);
						for(var key in userAuthToken){
							res.cookie(key, userAuthToken[key].value, userAuthToken[key].options);	
						}						
						//res.cookie("membership_status", newUser.membership_status,{httpOnly: false});
						res.send("Success");
						return;
					}
				}
				res.send("Email/Password combination incorrect");
			} catch (err) {
				console.log("caught error trying to login");
				console.log(err);
				res.send("Login error");
			}
		}
	});
};

module.exports.logout = function(req, res){
	try{
		for(var i = 0; i < authTokenKeys.length; i++){
			res.clearCookie(authTokenKeys[i]);
		}
		res.send("Success");
	} catch(err) {
		console.log(err);
	}
};



