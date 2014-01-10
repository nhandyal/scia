/*
 * Utils for test functions
 */

module.exports.parseCookie = function (cookieArray) {

	var parsedCookies = {},
		cookieTerm  = null;

	// version meant to be used in test bench code
	for(var i = 0; i < cookieArray.length; i++) {
		

		var cookieExpiryDate = null,
			splitCookie = cookieArray[i].split(";"),
			loopCookie = {};

		// check to see if the expiry date is there and process it accordingly
		if(splitCookie[2]) {
			cookieTerm = splitCookie[2].split("=");
			cookieExpiryDate = new Date(cookieTerm[1]);

			if(cookieExpiryDate < new Date()) {
				// expired cookie
				continue;
			}

			loopCookie.Expires = cookieExpiryDate;
		}

		// pull out the cookie path
		cookieTerm = splitCookie[1].split("="),
		loopCookie.Path = cookieTerm[1];

		// pull out the cookie key and value
		cookieTerm = splitCookie[0].split("="),
		loopCookie.value = cookieTerm[1];

		parsedCookies[cookieTerm[0]] = loopCookie;

	}

	return parsedCookies;
}