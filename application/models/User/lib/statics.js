var mongoose = require("mongoose");


/**
 *
 */
module.exports.findOneByEmail = function(email, onCompleteCallback) {
    var _model = mongoose.model("User");

    _model.findOne({email : email}, function(err, user) {
        if(err) {
            return onCompleteCallback(err, null);
        }

        if(!user) {
            return onCompleteCallback({
                scia_errcode : 10402
            }, null);
        }

        return onCompleteCallback(null, user);
    });
};


/**
 *
 */
module.exports.findOneByID = function(id, onCompleteCallback) {
    var _model = mongoose.model("User");

    _model.findById(id, function(err, user) {
        if(err) {
            return onCompleteCallback(err, null);
        }

        if(!user) {
            return onCompleteCallback({
                scia_errcode : 10402
            }, null);
        }

        return onCompleteCallback(null, user);
    });
};


/**
 *
 */
module.exports.checkIfEmailExists = function(email, onCompleteCallback) {
    User.invoke("UAuth.exists").withArgs(email, function(err, exists) {
        if(err) {
            return onCompleteCallback(err, null);
        }

        return onCompleteCallback(null, exists);
    });
};


/**
 * onCompleteCallback must accept err, user
 */
module.exports.create = function(userData, onCompleteCallback) {
    
    var user = new this(userData);
    
    try {
        user.invoke("UAuth.set").withArgs(userData);
    }catch(err) {
        return onCompleteCallback({
            scia_errcode : 10400
        }, null);
    }

    this.invoke("UAuth.exists").withArgs(userData.email, function(err, exists) {
        if(err) {
            return onCompleteCallback(err, null);
        }

        if(exists) {
            return onCompleteCallback({
                scia_errcode : 10001
            }, null);   
        }else {
            user.invoke("Stripe.createCustomerProfile").withArgs({
                email : userData.email,
                description : "Profile for " + userData.email
            }, function(err) {
                if(err) {
                    return onCompleteCallback(err, null);
                }

                user.save(function(err, user) {
                    if(err) {
                        return onCompleteCallback(err, null);
                    }
                    
                    console.log("new user created: " + user.f_name + " " + user.l_name + " - " + user.id);
                    return onCompleteCallback(null, user);                                      
                });
            });
        }
    });

};