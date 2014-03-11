/*
var mongoose = require("mongoose"),
	user = mongoose.model("user"),
	EventTicket = mongoose.model("event_ticket"),
	Event = mongoose.model("event"),
	User = mongoose.model("user"),
	utils = require("./utils"),
	async = require("async"),
	Hashids = require("hashids"),
	ResponseHandler = Utils.loadModule("ResponseHandler");

module.exports.submitPayment = function(req,res,transport) {
	var email = req.body.email;
	var stripe_card_id = req.body.StripeCardID;
	var stripe_token = req.body.stripeToken;
	var save_card = req.body.saveCard;
	var event_id = req.body.event_id;
	var ticket_count = req.body.ticket_count;
	var total = req.body.total;

	var charge_total = 0;
	var purchased_member_ticket = true;

	// Validate the user inputs

	if(ticket_count<1){
		utils.log("Invalid ticket order from "+email);
		utils.sendError(INSERTERROR);
	}
	
	if(!stripe_card_id && !stripe_token){
		return ResponseHandler.sendError(res, 10400);
	}
	
	// Verify the user's information is correct and that they have not previously purchased tickets for any of the events
	async.parallel({
		user: function(callback){
			user.find({email: email}, function(dbErr,dbRes){
				dbTransactionCallback(dbErr, dbRes, callback);
			});
		},
		tickets: function(callback){
			EventTicket.find({email: email}, function(dbErr,dbRes){
				dbTransactionCallback(dbErr, dbRes, callback);
			});
		},
		event_info: function(callback){
			Event.find({fb_id: event_id},function(err, dbRes){
				dbTransactionCallback(dbErr, dbRes, callback);
			});
		}
	}, function(err, results){
		if(err || results.user.dbErr || results.tickets.dbErr || results.event_info.dbErr){
			utils.log("Error finding the user or the tickets" +err);
			utils.sendError(res,10050);
		}
		
		var user = results.user;

		// Check if the user is a member, and if they have previously purchased a member ticket to this event
		if(user.is_member){
			purchased_member_ticket = false;
			for(var i=0;i<results.tickets.dbRes.length;i++){
				if(results.tickets.dbRes[i].event_id == event_id){
					purchased_member_ticket = true;
					break;
				}
			}	
		}

		var member_price;
		var non_member_price;
		var event_name = results.event_info.name;
		
		if(result[i].dbRes[0].member_price){
			member_price = parseInt(result[i].dbRes[0].member_price);
		} else {
			member_price = 0;
		}
		if(result[i].dbRes[0].non_member_price){
			non_member_price = parseInt(result[i].dbRes[0].non_member_price);
		} else {
			non_member_price = 0;
		}

		if(purchased_member_ticket){
			charge_total = ticket_count * non_member_price;
		} else {
			charge+total = (ticket_count-1) * non_member_price + member_price;
		}
		
		if(charge_total != total){
			utils.sendError(res,10103);
			utils.log("Failed Transaction for "+user.email+" calculated total: "+charge_total+"       input total: "+total);
			return;
		}

		hashids = new Hashids("nikhil loves programming",8);

		var ticket_number = hashids.encrypt(parseInt(new Date.getTime(),16)+parseInt(user._id,16));

		var ticket_data;
		if(!user.is_member){
			ticket_data = {
				f_name : f_name,
				l_name : l_name, 
				email : email,
				event_id : event_id,
				transportation : transportation,
				ticket_number : ticket_number,
				charge_total : charge_total
			}
		} else {
			ticket_data = {
				f_name : f_name,
				l_name : l_name, 
				email : email,
				card_id : card_id,
				event_id : event_id,
				transportation : transportation,
				ticket_number : ticket_number,
				charge_total : charge_total
			}
		}
		
		var event_ticket = new EventTicket(ticket_data);
		event_ticket.save(function(err, ticketDBRes){ 
			if(err) {
				return ResponseHandler.processError(res, err);
			}
			
			var requestParams = {
				cardID : stripe_card_id,
				stripeCardToken : stripe_card_token,
				amount : charge_total,
				description : 'Ticket for: ' + event_name + ' for member: ' + email
			}

			var chargeResponseHandler = function(err, charge) {
				if(err) {
					utils.log('Removing Failed Ticket ' +event_ticket);
					try {
						ticketDBRes.remove();
					} catch (err) {
						utils.log('Failed to remove ticket: '+event_ticket);
					}
					return ResponseHandler.processError(res, err);
				}

				var ticket_email_data = {
					title : "USC SCIA ticket email",
					email : "mgendott@usc.edu",
					ticket_token : ticket_number,
					total_price : charge_total
				 };
				try {
					res.render('email-templates/ticket_email', ticket_email_data, function(err, renderedHtml) {
						transport.sendMail({
							from : "no_reply@uscscia.com",
							to : ticket_email_data.email,
							subject : ticket_email_data.title,
							html : renderedHtml,
							charset : "UTF-8"
						}, function(error, response){
							if(error){
								utils.log("Error delivering message to " + ticket_email_data.email);
							}else{
								utils.log("Message sent: " + response.message);
							}
						}); // end transport.sendMail
					}); // end res.render
				} catch (err) {
					utils.log(err);
				}
				utils.sendSuccess(res);
			}

			if(stripe_card_id) {
				user.chargeExistingCard(requestParams, chargeResponseHandler);
			}else {
				if(save_card) {
					user.addCardAndCharge(requestParams, chargeResponseHandler);
				}else {
					user.chargeNewCard(requestParams, chargeResponseHandler);
				}
			}
		});     
	}); // end async parallel
}
*/
