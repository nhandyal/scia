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
