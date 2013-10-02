/*
 * Utility functions widely used across many controllers
 */

var development = true,
	response_codes = require('./response_codes');

/*
 * JSON encodes the response parameter and sends it with the response associated with this call
 * 
 * Parameters
 * 		res - node response object for this request
 *		response - response data for this request
 */
module.exports.sendResponse = function(res, response){
	res.send(JSON.stringify(response));
};


/*
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


/*
 * Returns a success message
 * 
 * Parameters
 * 		res - node response object for this request
 */
module.exports.sendSuccess = function(res){
	res.send(response_codes["_0"]);
};


/* 
 * Given a set of db transactions verifies that all transactions were committed successfully.
 * If a transaction failed, removes the successfull transactions from the db.
 * 
 * Parameters
 * 		results - object containing the transaction key and db result (if failed, db result must = false)
 *
 * Returns 
 *		Boolean - true is all transactions successfull, false otherwise
 */
module.exports.verifyDbWrites = function(results){
	for(var key in results){
		if(results[key].err){
			// first failed transaction
			for(var innerKey in results){
				if(!results[innerKey].err){
					// successfull transaction
					results[innerKey].dbRes.remove();
					console.log("removing "+innerKey+" from the db");
				}
			}
			return results[key].err.code;
		}
	}
	return 0;
};

/*
 * Utiity function that wraps system logging. In a development enviornment, surpresses log statements
 * 
 * Parameters
 * 		msg - message to log
 */
 module.exports.log = function(msg){
 	if(development)
 		console.log(msg);
 }