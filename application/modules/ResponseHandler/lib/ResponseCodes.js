/*
 * Response codes for all SCIA Operations
 */

module.exports._0 = {
	status : 0,
	short_message : "Success",
	long_message : "Success"
}


/**************** General API Errors ***************************/
module.exports._10400 = {
 	status : 10400,
 	short_message : "Bad Request",
 	long_message : "The request cannot be fulfilled due to bad syntax"
};

module.exports._10401 = {
	status : 10401,
	short_message : "Service Denied",
	long_message : "The request needs user authentication"
};

module.exports._10402 = {
	status : 10402,
 	short_message : "No matching records",
 	long_message : "No matching records were found with the given details"
}

module.exports._10500 = {
	status : 10500,
	short_message : "Internal Error",
	long_message : "The request was unsuccessful due to an unexpected condition encountered by the server"
};

module.exports._10501 = {
	status : 10501,
 	short_message : "Internal Error",
 	long_message : "DB Error"
}

/**************** Registration Response Codes ******************/
module.exports._10001 = {
 	status : 10001,
 	short_message : "Duplicate entry",
 	long_message : "Email is already registered"
};


/***************** Auth Response Codes *****************/
module.exports._10050 = {
	status : 10050,
	short_message : "Login failed",
	long_message : "Supplied password is incorrect"
};

module.exports._10051 = {
	status : 10051,
	short_message : "Unverified Account",
	long_message : "This account must be verified first. Check your email for further instructions"
}

module.exports._10052 = {
	status : 10052,
	short_message : "Invalid reset token",
	long_message : "The supplied reset token is invalid, request another."
}


/***************** Checkout Response Codes *****************/
module.exports._10100 = {
	status : 10100,
	short_message : "Transaction Failed",
	long_message : "The supplied card was declined"
}

/*
module.exports._10100 = {
	status : 10100,
	short_message : "Invalid cart",
	long_message : "A user attempted to purchase multiple tickets for the same event"
};
*/

module.exports._10101 = {
	status : 10101,
	short_message : "Invalid user",
	long_message : "The user information did not match the card number"
};
module.exports._10102 = {
	status : 10102,
	short_message : "Invalid credit card",
	long_message : "The credit card failed Stripe's authentication"
};
module.exports._10103 = {
	status : 10103,
	short_message : "Incorrect total",
	long_message : "The total does not match the total calculated from the database"
};