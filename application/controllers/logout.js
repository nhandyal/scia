
module.exports.logoutUser = function(req, res){
	try{
		res.clearCookie("f_name");
		res.clearCookie("l_name");
		//res.clearCookie("membership_status");
		//console.log("removed cookie");
		res.send("Success");
	} catch(err) {
		console.log(err);
	}
}

