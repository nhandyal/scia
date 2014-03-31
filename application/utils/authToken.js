var Crypto = require("crypto"),
    signatureKeys = ["id", "f_name", "l_name"],
    serverKeys =    ["sid", "sig"],
    authTokenKeys = ["id", "f_name", "l_name", "is_member", "sid", "sig"],

    clientOptions = {
        httpOnly : false,
        secure : false
    },

    serverOptions = {
        httpOnly : true,
        secure : (global.env == "test" ? false : true),
    },

    authToken = function(res, user) {
        
        /* 
         * Client Accesible Values
         *
         * These values are provided to allow client services to populate fields as nescessary.
         * They are insecure httpOnly false cookies and are meant to be read-only.
         */

        this.id = {
            value : user.id,
            options : clientOptions
        }

        this.f_name = {
            value : user.f_name,
            options : clientOptions
        };
        
        this.l_name = {
            value : user.l_name,
            options : clientOptions
        };

        this.is_member {
            value : user.is_member,
            options : clientOptions
        };

        
        /*
         * Server Accesible Values 
         *
         * 
         * All Server cookies must start with a lowercase 's'
         */


        // user id
        this.sid = {
            value : user.id,
            options : serverOptions
        };

        // cookie signature
        this.sig = {
            value : generateCookieSignature(this),
            options : serverOptions
        }

        // write the auth token to the res object
        for(var index in authTokenKeys) {
            var key = authTokenKeys[index];
            res.cookie(key, this[key].value, this[key].options);
        }


        return this;

    },

    generateCookieSignature = function(authToken) {
        var plainTextSignature = "";

        for(var index in signatureKeys) {
            var key = signatureKeys[index];
            plainTextSignature += authToken[key].value;
        }

        
        var md5 = Crypto.createHash("md5");
            sig = md5.update(plainTextSignature).digest("hex");

        return sig;
    },

    clearToken = function(res) {
        
        for(var index in authTokenKeys) {
            res.clearCookie(authTokenKeys[index]);
        }

    };


module.exports.clearAuthToken = function(res) {
    return clearToken(res);
};


module.exports.getNewAuthToken = function(res, user) {
    return new authToken(res, user);
};


/**
 * Create an auth token object off the request if it exists. If an auth token exists, sets req.loggedIn = true,
 * req.id = sid, otherwise req.loggedIn = false, req.id = null.
 */
module.exports.parseAuthToken = function(req, res, next) {
    
    for(var index in serverKeys) {
        var key = serverKeys[index];
        if(req.cookies[key] === undefined) {
            clearToken(res);
            return next();
        }
    }

    // all server keys present
    req.loggedIn = true;
    req.id = req.cookies.sid;

    return next();
};

module.exports.authorizeRequest = function(req, res, next) {
    
    if(!req.loggedIn) {
        return Utils.sendError(res, 10401);
    }

    return next();

};


