var mongoose = require("mongoose"),
	CIC = mongoose.model("CIC"),
	user = mongoose.model("user"),
	crypto = require("crypto");

module.exports.loginUser = function(req, res){

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
						res.cookie("f_name", newUser.f_name,{httpOnly: false}); //httpOnly is false so client-side JS can read it
						res.cookie("l_name", newUser.l_name,{httpOnly: false});
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
}

