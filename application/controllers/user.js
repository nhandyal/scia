var mongoose = require("mongoose"),
	CIC = mongoose.model("CIC"),
	user = mongoose.model("user"),

	getNextCICIndex = function(callback){
		CIC.findOneAndUpdate({}, {$inc: { CICIndex: 1 }}, {}, callback);
	};



module.exports.create = function(req, res){
	
	var response = {},
		
		userData = {
			f_name : req.body.firstName,
			l_name : req.body.lastName,
			email : req.body.email,
			mobile : req.body.phoneNumber,
			major : req.body.major,
			year : req.body.year,
			card_id : req.body.cardid,
			board : false ,
			created : new Date(),
			last_login : new Date()
		},

		newUser = new user(userData);

	newUser.save(function(err, newUser){
		if(err) {
			res.send("There was an error processing the request");
		}else {
			var confString = newUser.f_name + " " + newUser.l_name + " -- " + newUser.email + " -- cardid: " + newUser.card_id;
			res.send(confString);
		}
	});

}

module.exports.queryUser = function(req, res, cardIDString){

	var cardid = parseInt(cardIDString, 10);

	user.find({card_id : cardid}, function(dbErr, dbRes){
		if(dbErr){
			res.redirect(301, 'https://www.uscscia.com');
		}
		else{
			try{
				var newUser = dbRes[0],
					confString = newUser.f_name + " " + newUser.l_name + " -- " + newUser.email + " -- cardid: " + newUser.card_id;
				
				res.send(confString);
			} catch (err) {
				res.send("Invalid user id");
			}
		}
	});
}

module.exports.commitCardId = function(req, res){
	var cardData = {
		CICIndex	: 100044
	},

	cicindex = new CIC(cardData);
	cicindex.save();
	res.send("Something might have happend?");
}

module.exports.testcard = function(req, res){
	getNextSequence(function(dbErr, dbRes){
		
	});
}