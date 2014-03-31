/**
 * Nikhil Handyal
 * 1/6/14
 * 
 * Controller to handle all interaction with the user model in the database.
 */

var User = Utils.loadModel("User"),
    Tickets = Utils.loadModel("Tickets"),
    Membership = Utils.loadModel("Membership"),
    NodeMailer = Utils.loadModule("NodeMailer"),
    ResponseHandler = Utils.loadModule("ResponseHandler"),
    AuthToken = Utils.AuthToken;


/**
 * get user details
 * 
 * @route -/d1/user/{user_id}
 * @param params.id - user id
 */
 module.exports.get_details = function(res, params) {
    
    
    if(params.user_id == null) {
        return ResponseHandler.sendError(res, 10400);
    }

    User.findOneByID(params.user_id, function(err, user) {
        if(err) {
            return ResponseHandler.processError(res, err);
        }

        var user_data = user.getFullUserDetails();

        return ResponseHandler.sendSuccess(res, user_data);
    });

 }



/**
 * Creates a new user.
 * 
 * @route - /d1/user/create
 * @failure - 10001, 10400, 10501
 */
module.exports.create = function(res, params) {

    if(params.cb == null) {
        return ResponseHandler.sendError(res, 10400);
    }

    var userData = {
        f_name : params.f_name,
        l_name : params.l_name,
        email : params.email,
        pwd : params.pwd
    };
    
    User.create(userData, function(err, user) {
        if(err) {
            return ResponseHandler.processError(res, err);
        }

        var vrf_email_data = {
            template_path : application_root + "views/email-templates/vrf_email",
            from : "no_reply@uscscia.com",
            to : params.email,
            title : "USC SCIA verification email",
            vrf_link : params.cb + "?userID=" + user.id
        };

        NodeMailer.send(res, vrf_email_data, function() {});

        var responseData = {
            id  : user.id
        };

        return ResponseHandler.sendSuccess(res, responseData);
    }); // end User.createNewUser()
}; // end module create


/**
 * Login a user.
 */
module.exports.login = function(res, params) {
    
    var email = params.email,
        pwd = params.pwd;

    User.findOneByEmail(email, function(err, user) {
        if(err) {
            return ResponseHandler.processError(res, err);
        }

        user.login(pwd, function(err, user) {
            if(err) {
                return ResponseHandler.processError(res, err);
            }

            AuthToken.getNewAuthToken(res, user);
            return ResponseHandler.sendSuccess(res);
        });
    });

};


/**
 * log a user out
 */
module.exports.logout = function(res) {
    AuthToken.clearAuthToken(res);
    return ResponseHandler.sendSuccess(res);
}


/**
 * Send a verification email to a user that has already been created
 * 
 * @route - d1/user/resendVerificationEmail
 * @failure - 10001, 10400, 10401, 10501
 */
module.exports.resendVerificationEmail = function(res, params) {
    
    if(!params.email) {
        return ResponseHandler.sendError(res, 10400);
    }

    User.checkIfEmailExists(params.email, function(err, exists) {
        if(err) {
            return ResponseHandler.processError(res, err);
        }

        if(!exists) {
            return ResponseHandler.sendError(res, 10402);
        }

        var vrf_email_data = {
            template_path : application_root + "views/email-templates/vrf_email",
            from : "no_reply@uscscia.com",
            to : params.email,
            title : "USC SCIA verification email",
            vrf_link : "https://www.uscscia.com/d1/user/verify/"+user.id,
        };

        NodeMailer.send(res, vrf_email_data, function() {});

        return ResponseHandler.sendSuccess(res);

    });
};


/*
 * Initiate an account recovery process for a user. This is used if the user
 * has forgotten their login credentials and needs to change their password.
 * 
 * @param params.email - the email address associated with the account we are trying to recover
 * @param params.cb - the web url where the password reset form is located (see docs on why this is done)
 */
module.exports.recover = function(res, params) {

    User.findOneByEmail(params.email, function(err, user) {
        if(err) {
            return ResponseHandler.processError(res, err);
        }

        user.generateRecoverToken(function(err, recoverToken) {

            var pwd_reset_data = {
                template_path : application_root + "views/email-templates/pwd_reset_email",
                from : "no_reply@uscscia.com",
                to : user.email,
                title : "SCIA reset account password",
                f_name : user.f_name,
                reset_pwd_link : params.cb + "?id=" + user.id + "&token=" + recoverToken
            };

            NodeMailer.send(res, pwd_reset_data, function(){});

            if(global.env == "test") {
                // we need to send the client the reset token for testing purposes
                return ResponseHandler.sendSuccess(res, {token : recoverToken});
            }
            
            return ResponseHandler.sendSuccess(res);
        });

    });
};


/*
 * Reset the password for a user.
 *
 * @param params.id         - id of user that needs a password reset
 * @param params.token      - credential token authenticating this reset request
 * @param params.new_pwd    - new user password
 */
module.exports.reset = function(res, params) {

    var userDbID = params.id,
        token = params.token,
        new_pwd = params.new_pwd;

    
    User.findOneByID(userDbID, function(err, user) {
        if(err) {
            console.log(err);
            console.trace();
            return ResponseHandler.processError(res, err);
        }

        if(user.verifyRecoverToken(token)) {
            user.setPassword(new_pwd, function(err, user) {
                if(err) {
                    console.log(err);
                    console.trace();
                    return ResponseHandler.processError(res, err);
                }

                return ResponseHandler.sendSuccess(res);
            });
        }else {
            return ResponseHandler.sendError(res, 10052);   
        }
    });

};


/**
 * Verify an already created user
 * 
 * @route - /d1/user/verify*
 * @failure - 10001, 10400, 10401, 10501
 */
module.exports.verifyUser = function(res, params) {

    User.findOneByID(params.id, function(err, user) {
        if(err) {
            return ResponseHandler.processError(res, err);
        }

        user.verifyUser(function(err, user) {
            if(err) {
                return ResponseHandler.processError(res, err);
            }

            return ResponseHandler.sendSuccess(res);
        });
    });

};

/**
 * 
 * @param params.id - the db id of this user
 * @param params.stripeCardToken - Stripe token to be charged. If params.stripeCardID is specified
 *                                  This value is ignored. However either params.stripeToken or
 *                                  params.stripeCardID must be present.
 * @param params.stripeCardID - A saved stripe card id for this user.
 * @param params.saveCard - a flag on whether this card should be saved to this user's profile.
 * @param params.amountAuthorized - the amount a user has authorizd to be charged on their card.
 */
module.exports.buyMembership = function(res, params) {

    if(!params.stripeCardToken && !params.stripeCardID) {
        return ResponseHandler.sendError(res, 10400);
    }

    var amountAuthorized = parseInt(params.amountAuthorized);

    User.findOneByID(params.id, function(err, user) {
        if(err) {
            return ResponseHandler.processError(res, err);  
        }

        if(user.member()) {
            // user is already a member
            return ResponseHandler.processError(res, {
                scia_errcode : 10002
            });
        }

        Membership.getLatestMembershipPrice(function(err, membershipPrice) {

            if(membershipPrice != amountAuthorized) {
                return ResponseHandler.sendError(res, 10103);
            }

            var requestParams = {
                cardID : params.stripeCardID,
                stripeCardToken : params.stripeCardToken,
                amount : membershipPrice,
                description : "SCIA Membership"
            }

            var chargeResponseHandler = function(err, charge) {
                if(err) {
                    return ResponseHandler.processError(res, err);
                }

                var set_membership = user.set_membership();
                if (set_membership.err) {
                    return ResponseHandler.processError(res, set_membership);
                } 

                Tickets.createMembershipTicket(user, {
                    'transaction_total' : amountAuthorized                    
                }, function(err, ticket) {
                    if(err) {
                        console.log("there was an error writing the ticket to the db");
                        console.log("unfortunately we don't have any error handling for this");
                        console.log("contact Tanmay Asija to resolve this conflict");
                    } else {
                        console.log(ticket);
                    }
                });

                user.save(function(err) {
                    if(err) {
                        return ResponseHandler.processError(res, err);
                    }

                    return ResponseHandler.sendSuccess(res);
                });
            }

            if(params.stripeCardID) {
                user.chargeExistingCard(requestParams, chargeResponseHandler);
            }else {
                if(params.saveCard) {
                    user.addCardAndCharge(requestParams, chargeResponseHandler);
                }else {
                    user.chargeNewCard(requestParams, chargeResponseHandler);
                }
            }
        });

    });
};