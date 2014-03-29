var processStripeError = function(err) {
    if(err.type == "StripeError") {
        return {
            scia_errcode : err.code,
            msg : err.msg
        }
    }else {
        return err;
    }
}

module.exports.login = function(pwd, onCompleteCallback) {
    var user = this;

    // ensure the user is verified
    if(!user.is_verified) {
        return onCompleteCallback({
            scia_errcode : 10051
        }, null);
    }

    user.invoke("UAuth.authenticate").withArgs(pwd, function(err, authenticated) {
        if(err) {
            Utils.logError(err);
            return onCompleteCallback(err, null);
        }

        if(!authenticated) {
            return onCompleteCallback({
                scia_errcode : 10050
            }, null);
        }

        return onCompleteCallback(null, user);
    });
};


module.exports.setPassword = function(pwd, onCompleteCallback) {
    var user = this;
    
    try {
        user.invoke("UAuth.set").withArgs("pwd", pwd);
    }catch(err) {
        return onCompleteCallback({
            scia_errcode : 10400
        }, null);
    }

    user.save(function(err) {
        if(err) {
            return onCompleteCallback(err, null);
        }

        return onCompleteCallback(null, user);
    });
};


module.exports.generateRecoverToken = function(onCompleteCallback) {
    var token = Date.now();
    this.update({
        pwd_reset_token : token,
    }, function(err) {      
        if(err) {
            return onCompleteCallback(err, null);
        }

        return onCompleteCallback(null, token);
    });
};


module.exports.verifyRecoverToken = function(candidateRecoverToken) {
    // check that the link is legitamte
    if(candidateRecoverToken != this.pwd_reset_token) {
        return false;
    }

    // check that the link is still valid
    var expirationDate = parseInt(candidateRecoverToken) + (1000 * 60 * 60);
    if(Date.now() >= expirationDate) {
        return false;
    }

    return true;
};


module.exports.verifyUser = function(onCompleteCallback) {
    this.is_verified = true;
    this.save(function(err, user){
        if(err) {
            return onCompleteCallback(err, null);
        }

        return onCompleteCallback(null, user);
    });
};

/**
 *
 * @param params.stripeCardToken - stripe card token
 */
module.exports.addCard = function(params, onCompleteCallback) {
    var user = this;

    user.invoke("Stripe.addCard").withArgs(params, function(err, card) {
        if(err) {
            return onCompleteCallback(processStripeError(err), null);
        }

        user.save(function(err, user) {
            if(err) {
                return onCompleteCallback(err, null);
            }

            return onCompleteCallback(null, card);
        });
    });
};

/**
 * @param params.stripeCardToken - stripe card token
 * @param params.amount - amount to charge card (in dollars)
 * @param params.description - description of charge
 */
module.exports.addCardAndCharge = function(params, onCompleteCallback) {
    var user = this;

    user.invoke("Stripe.addCard").withArgs(params, function(err, card) {
        if(err) {
            return onCompleteCallback(processStripeError(err), null);
        }

        user.save(function(err){
            if(err) {
                Utils.logError(err);
            }
        })

        params.cardID = card.id;

        user.invoke("Stripe.chargeExistingCard").withArgs(params, function(err, charge) {
            if(err) {
                return onCompleteCallback(processStripeError(err), null);
            }

            return onCompleteCallback(null, card, charge);
        });
        
    });
};

/**
 * @param params.stripeCardTokem - stripe card token
 * @param params.amount - amount to charge card (in dollars)
 * @param params.description - description of charge
 */
module.exports.chargeNewCard = function(chargeParams, onCompleteCallback) {
    this.invoke("Stripe.chargeNewCard").withArgs(chargeParams, function(err, charge) {
        if(err) {
            return onCompleteCallback(processStripeError(err), null);
        }

        return onCompleteCallback(null, charge);
    });
};


/**
 * @param params.cardID - id of card to charge, must already be saved to 
                            customer profile. This is not a stripe token.
 * @param params.amount - amount to charge card (in dollars)
 * @param params.description - description of charge
 */
module.exports.chargeExistingCard = function(params, onCompleteCallback) {
    this.invoke("Stripe.chargeExistingCard").withArgs(params, function(err, charge) {
        if(err) {
            return onCompleteCallback(processStripeError(err), null);
        }

        return onCompleteCallback(null, charge);
    });
}