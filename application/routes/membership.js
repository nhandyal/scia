var Url = require("url"),
	membership = Utils.loadController("membership");

module.exports = function(app) {

	/**
	 * @param req.body.price - new membership price
	 */
	app.post("/d1/membership/update", function(req, res) {
		var params = {
			price : req.body.price
		}

		membership.update(res, params);
	});

	app.get("/d1/membership", function(req, res) {
		
		membership.getCurrentPrice(res);
	});

};