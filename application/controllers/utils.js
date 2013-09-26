/*
 * Utility functions widely used across many controllers
 */


/*
 * JSON encodes the response object and sends it with the response associated with this call
 * 
 * Parameters
 * 		res - node response object for this request
 *		response - response data for this request
 */
module.exports.sendResponse = function(res, response){
	res.send(JSON.stringify(response));
},


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
module.exports.verifyDbTransactions = function(results){
	for(var key in results){
		if(!results[key]){
			// failed element
			for(var innerKey in results){
				if(results[innerKey]){
					results[innerKey].remove();
					console.log("removing "+innerKey+" from the db");
				}
			}
			return false;
		}
	}
	return true;
};