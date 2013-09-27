/*
 * Response codes for all SCIA Operations
 */


/**************** Registration Response Codes ******************/

module.exports._0 = {
	status : 0,
	short_message : "Success",
	long_message : "Success"
}

module.exports._10001 = {
 	status : 10001,
 	short_message : "Internal Error",
 	long_message : "Unable to stage new user to database"
};

module.exports._10002 = {
 	status : 10002,
 	short_message : "Internal Error",
 	long_message : "Account created, Unable to send verification email"
};