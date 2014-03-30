var mongoose = require("mongoose"),
    Hashids = require("hashids")
    hashids = new Hashids("A Ping-Pong Orchestra",8);


/**
 * @param ticket_data {
 *      ticket_description      : string
 *      number_of_tickets       : int,
 *      transaction_total       : float,
 *      contains_member_ticket  : boolean
 * }
 * 
 * @return onCompleteCallback(err, ticket)
 */
module.exports.createEventTicket = function(user_model, 
                                        event_model, 
                                        ticket_data,
                                        onCompleteCallback) {

    if(ticket_data.number_of_tickets == null || 
        ticket_data.transaction_total == null || 
        user_model == null || 
        event_model == null) {
            return onCompleteCallback({
                scia_errcode : 10400
            }, null);
    }

    var user_details = user_model.getCoreUserDetails(),
        ticket_number = hashids.encrypt(parseInt(new Date.getTime(),16)+parseInt(user.user_id,16));

    // this doesn't exist yet, but we should set it up at a later point
    // var event_details = event_model.getCoreDetails();



    // merge the user details into ticket_data
    // user_details returns some extra information
    // but we'll let mongoose automatically drop that data
    for (var attrname in user_details) { 
        ticket_data[attrname] = user_details[attrname]; 
    }

    ticket_data["ticket_id"] = ticket_number;
    ticket_data["event_id"] = event_model._id;

    // build transaction details
    var number_of_tickets = ticket_data.number_of_tickets,
        transaction_details = [];
    if(ticket_data.contains_member_ticket) {
        transaction_details.push({
            "quantity_sold" : 1,
            "sale_price"    : event_model.member_price
        });
        number_of_tickets --;
    }

    // push the remaining "non-member" ticket details
    transaction_details.push({
        "quantity_sold" : 1,
        "sale_price"    : event_model.non_member_price
    });


    // create a new ticket document and save it to the db
    var ticket = new this(ticket_data);
    ticket.save(function(err, ticket){
        if(err) {
            return onCompleteCallback(err, null);
        }

        return onCompleteCallback(null, ticket);
    });
    
};

module.exports.create