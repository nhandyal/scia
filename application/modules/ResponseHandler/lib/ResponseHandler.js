/*
 * 
 */
 
var response_codes = require('./ResponseCodes');


/**
 * JSON encodes the response parameter and sends it with the response associated with this call
 * 
 * @param res - node response object for this request
 * @param response - response data for this request
 */
module.exports.sendResponse = function(res, response){
	res.json(response);
};


/**
 * Returns the error messge associated with error_code
 * 
 * @res - node response object for this request
 * @error_code - error code to send to client
 */
module.exports.sendError = function(res, error_code, long_message){
	var error_key = "_"+error_code,
		error_object = response_codes[error_key];

	if(long_message) {
		error_object.long_message = long_message;
	}
	
	if(!error_object) {
		console.log("unknown error code", error_code);
		console.trace();
	}

	res.json(error_object);
};


/**
 * Send a success message to the client. Adds the response data under the data section of the response.
 * The data field is optional and can be omitted.
 * 
 * @param res - node response object for this request.
 * @param data - data to be returned to the client.
 */
module.exports.sendSuccess = function(res, data) {
	var response = response_codes["_0"];
	response.data = data;

	res.json(response);
};


/**
 * Given a mongoose error, process the error and sends the appropriate error message to the client.
 * 
 * @param err - the mongoose error to be processed
 * @param res - an express response object
 */
module.exports.processError = function(res, err) {
    if(err.name == "MongoError") {
		if(err.code == 11000) {
			return this.sendError(res, 10001);
		}
		else {
			console.log(err);
			return this.sendError(res, 10501);
		}
    } else if(err.name == "ValidationError") {
        return this.sendError(res, 10400);
    } else if(err.scia_errcode) {

    	if(err.scia_errcode == 10601 || err.scia_errcode == 10602) {
    		return this.sendError(res, err.scia_errcode, err.msg);
    	}

    	return this.sendError(res, err.scia_errcode);
    }
    else {
		return this.sendError(res, 10500);
    }
};