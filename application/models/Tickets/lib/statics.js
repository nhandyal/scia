var mongoose = require("mongoose"),
    Hashids = require("hashids")
    hashids = new Hashids("A Ping-Pong Orchestra",8),

    createTicketId = function(seed) {
        return hashids.encrypt(parseInt(new Date().getTime(),16)+parseInt(seed,16));
    };


/**
 * logs buying a ticket to an event for a single user. The user can
 * purchase multiple tickets on one ticket log.
 * 
 * @param user_model - user to log tickets for
 * @param event_model - event to log tickets for
 * @param ticket_data {
 *      description             : string
 *      number_of_tickets       : int,
 *      transaction_total       : float,
 *      contains_member_ticket  : boolean
 * }
 * @param onCompleteCallback
 * 
 * @return onCompleteCallback(err, ticket)
 */
module.exports.createEventTicket = function(user_model, 
                                        event_model, 
                                        ticket_data,
                                        onCompleteCallback) {

    if(ticket_data.number_of_tickets == null || 
        ticket_data.transaction_total == null || 
        event_model == null) {
            return onCompleteCallback({
                scia_errcode : 10400
            }, null);
    }
	console.log(user_model);
    if(user_model == null){
	//guest checkout
	ticket_id = createTicketId(Math.random()*50000);
	
	//make guest fields filled out
	ticket_data["l_name"] = "guest";
	ticket_data["f_name"] = "guest";
    } else {
	var user_details = user_model.getCoreUserDetails(),
	ticket_id = createTicketId(user_details.user_id.getTimestamp().getTime());

	    // this doesn't exist yet, but we should set it up at a later point
	    // var event_details = event_model.getCoreDetails();



	    // merge the user details into ticket_data
	    // user_details returns some extra information
	    // but we'll let mongoose automatically drop that data
	    for (var attrname in user_details) { 
		ticket_data[attrname] = user_details[attrname]; 
	    }
    }
    ticket_data["ticket_id"] = ticket_id;
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
        "quantity_sold" : number_of_tickets,
        "sale_price"    : event_model.non_member_price
    });

    ticket_data["transaction_details"] = transaction_details;


    // create a new ticket document and save it to the db
    var ticket = new this(ticket_data);
    ticket.save(function(err, ticket){
        if(err) {
            return onCompleteCallback(err, null);
        }

        return onCompleteCallback(null, ticket);
    });
    
};

/**
 * logs a single membership transaction for a user
 *
 * @param user_model - user to log membership for
 * @param ticket_data {
 *      transaction_total       : float,
 * }
 * @param onCompleteCallback
 * 
 * @return onCompleteCallback(err, ticket)
 */
module.exports.createMembershipTicket = function(user_model, ticket_data, onCompleteCallback) {

    if(ticket_data.transaction_total == null || 
        user_model == null) {
            return onCompleteCallback({
                scia_errcode : 10400
            }, null);
    }

    var user_details = user_model.getCoreUserDetails(),
        ticket_id = createTicketId(user_details.user_id.getTimestamp().getTime());


    // figure out the description
    // if now.month() > 5 (may), use this year and next year
    // if now.month() <= 5 (may), use last and this year
    var now = new Date(),
        start = 0,
        end = 0;
    if(now.getMonth() > 5) {
        start = now.getFullYear();
        end = now.getFullYear() + 1;
    } else {
        start = now.getFullYear() - 1;
        end = now.getFullYear();
    }

    var description = "Membership for academic year " + start + "-" + end;

    // merge the user details into ticket_data
    // user_details returns some extra information
    // but we'll let mongoose automatically drop that data
    for (var attrname in user_details) { 
        ticket_data[attrname] = user_details[attrname]; 
    }

    ticket_data["ticket_id"] = ticket_id;
    ticket_data["transaction_details"] = [{
        "quantity_sold" : 1,
        "sale_price" : ticket_data.transaction_total
    }];
    ticket_data["description"] = description;
    ticket_data["number_of_tickets"] = 1;
    ticket_data["redeemed"] = true;

    
    // create a new ticket document and save it to the db
    var ticket = new this(ticket_data);
    ticket.save(function(err, ticket){
        if(err) {
            return onCompleteCallback(err, null);
        }

        return onCompleteCallback(null, ticket);
    });

}
