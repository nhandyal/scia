var mongoose = require("mongoose"),
	User = Utils.loadModel("User"),
	Event = mongoose.model("event"),
	async = require("async"),
	Ticket = Utils.loadModel("Tickets"),
	NodeMailer = Utils.loadModule("NodeMailer"),
	ResponseHandler = Utils.loadModule("ResponseHandler");

module.exports.submitPayment = function(req,res,transport) {
	var email = req.body.email;
	var stripe_card_id = req.body.StripeCardID;
	var stripe_card_token = req.body.stripeToken;
	var save_card = req.body.saveCard;
	if(save_card == "true") { 
		save_card = true;
	} else {
		save_card = false;
	}
	var event_id = req.body.event_id;
	var ticket_count = req.body.ticket_count;
	var total = req.body.amountAuthorized;

	var charge_total = 0;
	var purchasing_member_ticket = false;

	// Validate the user inputs

	if(ticket_count<1){
		utils.log("Invalid ticket order from "+email);
		utils.sendError(INSERTERROR);
	}
	
	if(!stripe_card_id && !stripe_card_token){
		console.log(stripe_card_id + "  "+stripe_card_token);
		return ResponseHandler.sendError(res, 10400);
	}
	
	// Verify the user's information is correct and that they have not previously purchased tickets for any of the events
	async.parallel({
		user: function(callback){
			User.findOneByEmail(email, function(dbErr,dbRes){
				dbTransactionCallback(dbErr, dbRes, callback);
			});
		},
		tickets: function(callback){
			Ticket.find({email: email}, function(dbErr,dbRes){
				dbTransactionCallback(dbErr, dbRes, callback);
			});
		},
		event_info: function(callback){
			Event.find({_id: event_id},function(dbErr, dbRes){
				dbTransactionCallback(dbErr, dbRes, callback);
			});
		}
	}, function(err, results){
		if(err || results.tickets.err || results.event_info.err){
			console.log("Error finding the event or the tickets" +err);
			return ResponseHandler.sendError(res,10050);
		}

		if(results.event_info.dbRes.length < 1){
			console.log("Could not find the event" + results.event_info);
			return ResponseHandler.sendError(res,10050);
		}
		
		var event = results.event_info;
		var found_user = null;

		if(!results.user.err){
			found_user = results.user.dbRes;
			email = found_user.email
                //purchasing with an account	
			// Check if the user is a member, and if they have previously purchased a member ticket to this event
			if(found_user.is_member){
				purchasing_member_ticket = true;
				for(var i=0;i<results.tickets.dbRes.length;i++){
					if(results.tickets.dbRes[i].event_id == event_id){
						purchasing_member_ticket = false;
						break;
					}
				}	
			}
                } 


		var member_price;
		var non_member_price;
		var event_name = results.event_info.name;
		
		if(event.dbRes[0].member_price){
			member_price = parseInt(event.dbRes[0].member_price);
		} else {
			member_price = 0;
		}
		if(event.dbRes[0].non_member_price){
			non_member_price = parseInt(event.dbRes[0].non_member_price);
		} else {
			non_member_price = 0;
		}

		if(!purchasing_member_ticket){
			charge_total = ticket_count * non_member_price;
		} else {
			charge_total = (ticket_count-1) * non_member_price + member_price;
		}
		
		if(charge_total != total){
			ResponseHandler.sendError(res,10103);
			console.log("Failed Transaction for "+email+" calculated total: "+charge_total+"       input total: "+total);
			return;
		}

		var requestParams = {
			cardID : stripe_card_id,
			stripeCardToken : stripe_card_token,
			amount : charge_total,
			description : 'Ticket for: ' + event_name + ' for member: ' + email
		}

		var chargeResponseHandler = function(err, charge) {
			if(err) {
				return ResponseHandler.processError(res, err);
			}

			var ticket_data = {
						"description" 	:	"Ticket to "+event.dbRes[0].name,
						"number_of_tickets" 	:	ticket_count,
						"transaction_total" 	: 	charge_total,
						"contains_member_ticket": 	purchasing_member_ticket,
						"email" : 			email
			}
			Ticket.createEventTicket(found_user, event.dbRes[0], ticket_data, function(err, ticket){
				 if(err) {
                        		console.log("there was an error writing the ticket to the db");
                        		console.log("unfortunately we don't have any error handling for this");
                        		console.log("contact Tanmay Asija to resolve this conflict");
                    		}
				var ticket_email_data = {
					template_path : application_root + "views/email-templates/ticket_email",
					from : "no_reply@uscscia.com",
					title : "USC SCIA ticket email",
					to : email,
					ticket_token : ticket_count,
					total_price : charge_total,
					event_name: event.dbRes[0].name,
					event_date: event.dbRes[0].start_time,
					confirmation_code: ticket.ticket_id
				 };
				try {
					NodeMailer.send(res, ticket_email_data, function(){});
				} catch (err) {
					console.log(err);
				}
				return ResponseHandler.sendSuccess(res);
			});
		}
		if(stripe_card_id) {
			found_user.chargeExistingCard(requestParams, chargeResponseHandler);
		} else {
			if(save_card) {
				found_user.addCardAndCharge(requestParams, chargeResponseHandler);
			}else {
				if(!results.user.err){
					//Checkout if a registered member
					found_user.chargeNewCard(requestParams, chargeResponseHandler);
				} else {
					//Checkout if a guest
					user = new User()
					user.chargeNewCard(requestParams, chargeResponseHandler);

				}
			}
		}

	}); // end async parallel
}
