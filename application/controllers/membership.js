var mongoose = require("mongoose"),
	Membership = mongoose.model("membership"),
	ResponseHandler = Utils.loadModule("ResponseHandler");


module.exports.update = function(res, params) {
	var price = parseInt(params.price);

	if(price < 0) {
		return ResponseHandler.sendError(res, 10400);
	}

	Membership.createNew(price, function(err) {
		if(err) {
			return ResponseHandler.processError(res, err);
		}

		return ResponseHandler.sendSuccess(res);
	});
};

module.exports.getCurrentPrice = function(res) {
	Membership.getLatestMembershipPrice(function(err, price) {
		if(err) {
			return ResponseHandler.processError(res, err);
		}

		var responseData = {
			price : price
		};
		
		return ResponseHandler.sendSuccess(res, responseData);
	});
};