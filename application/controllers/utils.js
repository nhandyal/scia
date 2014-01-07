/*
 * Utility functions widely used across many controllers
 */

var response_codes = require('./response_codes');

/**
 * JSON encodes the response parameter and sends it with the response associated with this call
 * 
 * Parameters
 * 		res - node response object for this request
 *		response - response data for this request
 */
module.exports.sendResponse = function(res, response){
	res.send(JSON.stringify(response));
};


/**
 * Returns the error messge associated with error_code
 * 
 * Parameters
 * 		res - node response object for this request
 *		error_code - error code to send to client
 */
module.exports.sendError = function(res, error_code){
	var error_key = "_"+error_code,
		error_object = response_codes[error_key];
	
	res.send(error_object);
};


/**
 * Send a success message to the client
 * 
 * @param res - node response object for this request
 */
module.exports.sendSuccess = function(res){
	res.send(response_codes["_0"]);
};

/**
 * Given a mongoose error, process the error and sends the appropriate error message to the client.
 * 
 * @param err - the mongoose error to be processed
 * @param res - an express response object
 */
module.exports.processMongooseError = function(err, res) {
    if(err.name == "MongoError") {
		if(err.code == 11000) {
			return this.sendError(res, 10001);
		}
		else {
			// something else happend
			this.log(err);
			return this.sendError(res, 10501);
		}
    } else if(err.name == "ValidationError") {
        return this.sendError(res, 10400);
    }
}

/**
 * Utiity function that wraps system logging.
 * 
 * @param msg - message to log
 */
 module.exports.log = function(msg){
 		console.log(msg);
 }
