var mongoose = require("mongoose");


/**
 *
 */
module.exports.getLatestMembershipPrice = function(onCompleteCallback) {
	var _model = mongoose.model("membership");

	_model.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, membershipDocument) {
  		if(err) {
  			return onCompleteCallback(err, null);
  		}

  		if(!membershipDocument) {
  			return onCompleteCallback({
  				scia_errcode : 10500
  			}, null);
  		}
  		
  		return onCompleteCallback(null, membershipDocument.price);
	});
}


/**
 *
 */
module.exports.createNew = function(price_point, onCompleteCallback) {
	var membershipDocument = new this({
		price : price_point
	});

	membershipDocument.save(function(err, membershipDocument) {
		if(err) {
			return onCompleteCallback(err, null);
		}

		return onCompleteCallback(null, membershipDocument);
	});
};