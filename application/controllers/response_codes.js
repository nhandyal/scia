/*
 * Response codes for all SCIA Operations
 */

module.exports._0 = {
	status : 0,
	short_message : "Success",
	long_message : "Success"
}


/**************** General API Errors ***************************/
module.exports._10403 = {
	status : 10403,
	short_message : "Service restricted",
	long_message : "Must be logged in to access this service"
};

module.exports._10500 = {
	status : 10500,
	short_message : "Internal Error",
	long_message : "Internal Error"
};


/**************** Registration Response Codes ******************/
module.exports._10001 = {
 	status : 10001,
 	short_message : "DB error",
 	long_message : "Unable to stage new user to database. DB Error"
};

module.exports._10002 = {
 	status : 10002,
 	short_message : "Duplicate entry",
 	long_message : "Email is already registered"
};

module.exports._10003 = {
 	status : 10003,
 	short_message : "Verify failed",
 	long_message : "Supplied vrf_token does not match token on file"
};

module.exports._10004 = {
 	status : 10004,
 	short_message : "Account already verified",
 	long_message : "Account already verified"
};

/***************** Login Response Codes *****************/
module.exports._10050 = {
	status : 10050,
	short_message : "Login failed",
	long_message : "Email/password combination was not correct"
};
/***************** Checkout Response Codes *****************/
module.exports._10100 = {
	status : 10100,
	short_message : "Invalid cart",
	long_message : "A user attempted to purchase multiple tickets for the same event"
};
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
