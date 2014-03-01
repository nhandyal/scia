//var Billing = require(global.application_root + "utils/stripeWrapper");


module.exports.test = function(req, res) {
	/*	
	Billing.chargeUser("nikhl").theAmount(50)._for("membership").usingStripeToken(req.body.stripeToken).onComplete(res, function() {
		res.send("done");
	});
*/
};
var stripe_key = "sk_test_mkGsLqEW6SLnZa487HYfJVLf";
var mongoose = require("mongoose"),
	user = mongoose.model("user"),
	EventTicket = mongoose.model("event_ticket"),
	Event = mongoose.model("event"),
	User = mongoose.model("user"),
	utils = require("./utils"),
	async = require("async"),
	stripe = require("stripe")(stripe_key),
	Hashids = require("hashids"),
	ResponseHandler = Utils.loadModule("ResponseHandler");

dbTransactionCallback = function(err, dbRes, callback, save){
		if(typeof(save)==='undefined') save = false;
                var transactionSummary = {
                        err : err,
                        dbRes : dbRes,
			save: save
                };
                return callback(null, transactionSummary);
}

makeCartFunction = function(f_name,l_name,email,card_id,event_id,transportation){
	return function(callback){
		if(card_id == null){
			ticket_data = {
				f_name : f_name,
				l_name : l_name, 
				email : email,
				event_id : event_id,
				transportation : transportation
			}
		} else {
			ticket_data = {
				f_name : f_name,
				l_name : l_name, 
				email : email,
				card_id : card_id,
				event_id : event_id,
				transportation : transportation
			}
		}
        	event_ticket = new EventTicket(ticket_data);
        	event_ticket.save(function(err, dbRes){ 
                	dbTransactionCallback(err, dbRes, callback);
        	});     
	}       
}

makeEventFunction = function(event_id){
	return function(callback){
		Event.find({fb_id: event_id},function(err, dbRes){
			dbTransactionCallback(err, dbRes, callback, true);
		});
	}
}

function removeFailedTickets(tickets){
	for( var i=0;i<tickets.length;i++) {
		utils.log("In removeFailedTickets" +tickets[i]);
		try {
			tickets[i].dbRes.remove();
		} catch (err) {
		}
	}
}

module.exports.submitPayment = function(req,res,transport) {
	var email = req.body.email;
	var stripe_token = req.body.stripeToken;
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

		// Check if the user is a member, and if they have previously purchased a member ticket to this event
		if(results.user.is_member){
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
		
		//multiply charge total by 100 to get the proper stripe amount
		charge_total *= 100;

		if(charge_total != total){
			utils.sendError(res,10103);
			utils.log("Failed Transaction for "+results.user.email+" calculated total: "+charge_total+"       input total: "+total);
			return;
		}

		hashids = new Hashids("nikhil loves programming",8);

		var ticket_number = hashids.encrypt(parseInt(new Date.getTime(),16)+parseInt(results.user._id,16));

		var ticket_data;
		if(!results.user.is_member){
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
		event_ticket.save(function(err, dbRes){ 
			if(err) {
				return ResponseHandler.processError(res, err);
			}
			
			// TODO: Update to use member account instead of just a one-off charge
			stripe.charges.create({ amount: charge_total,
						currency: 'USD',
						card: stripe_token},
				function(error,results){
					if(error){
						utils.log("Stripe Error: "+error);
						utils.sendError(res,10102);
						removeFailedTickets(result);
						return;
					}
					var ticket_email_data = {
					title : "USC SCIA ticket email",
						email : "mgendott@usc.edu",
						ticket_token : ticket_number,
						total_price : charge_total/100
					 };
					utils.log(ticket_email_data);	
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
			});
		});     
	}); // end async parallel
}

module.exports.submitPayment = function(req,res,transport) {
	// Read in information passed in
	var f_name = req.body.f_name;
	var l_name = req.body.l_name; 
	var email = req.body.email;
	var stripe_token = req.body.stripeToken;
	var count = req.body.count;
	var total = req.body.total;

	var charge_total = 0;
	var card_id = "undefined";

	if(member_tickets.length>0){
		// Verify the user's information is correct and that they have not previously purchased tickets for any of the events
		async.parallel({
			user: function(callback){
				user.find({email: email}, function(dbErr,dbRes){
					dbTransactionCallback(dbErr, dbRes, callback);
				});
			      },
			tickets: function(callback){
				EventTicket.find({card_id: card_id}, function(dbErr,dbRes){
					dbTransactionCallback(dbErr, dbRes, callback);
				});
			}
		}, function(err, results){
			if(err || results.user.dbErr || results.tickets.dbErr){
				utils.log("Error finding the user or the tickets" +err);
				utils.sendError(res,10050);
			}

			// Verify that none of the tickets being bought overlaps with previous tickets
			for(var i=0;i<results.tickets.dbRes.length;i++){
				var ticket = results.tickets.dbRes[i];
				for(var j=0;j<cart.length;j++){
					if(cart[j].eventID && ticket.event_id == cart[j].eventID){
						utils.sendError(res,10100);
						return;
					}
				}
			}
			
			// Create a unified ticket array to query the database
			var tickets = [];

			// Add all the member tickets to the unified ticket array
			for(var i=0;i<member_tickets.length;i++){
				tickets.push(member_tickets[i]);
			}

			// Add all the non_members tickets to the unified ticket array
			for(var i=0;i<non_member_tickets.length;i++){
				tickets.push(non_member_tickets[i]);
			}

			var user_info = results.user.dbRes[0];

			if(user_info.f_name === f_name && user_info.l_name === l_name && user_info.card_id === card_id){
				async.parallel(
					tickets, 
					function(err, result){
					 // ensure there were no failures in the db transactions
					 var transactionResult = utils.verifyDbWrites(result);
					 if (transactionResult == 11000) {
						 utils.sendError(res, 10002);
						 return;
					 }
					 else if(transactionResult != 0){
						 utils.sendError(res, 10001);
						 return;
					 }
				
					var ticket_numbers = [];	
					var event_name = "Error";
					var member_price = 0;
					var non_member_price = 0;
					var transportation = 0;
					for(var i=0;i<result.length;i++) {
						if(result[i].dbRes.length>0 && result[i].dbRes[0].name){
							event_name = result[i].dbRes[0].name;
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
							if(result[i].dbRes[0].transportation){
								transportation = parseInt(result[i].dbRes[0].transportation_price);
							} else {
								transportation = 0;
							}
						} else {
							ticket_numbers.push({event:event_name,code: result[i].dbRes._id,member_id: result[i].dbRes.card_id,transportation: result[i].dbRes.transportation});
							if(result[i].dbRes.card_id == null) {
								charge_total += non_member_price;
							} else {
								charge_total += member_price;
							}
							if(!result[i].dbRes.transportation){
								charge_total-=transportation;
							}
						}
					}

					//multiply charge total by 100 to get the proper stripe amount
					charge_total *= 100;
			
					utils.log("calculated total: "+charge_total+"       input total: "+total);

					if(charge_total != total){
						utils.sendError(res,10103);
						removeFailedTickets(result);
						return;
					}

					stripe.charges.create({ amount: charge_total,
                                                                currency: 'USD',
                                                                card: stripe_token},
                                                function(error,results){
                                                        if(error){
                                                                utils.log("Stripe Error: "+error);
                                                                utils.sendError(res,10102);
								removeFailedTickets(result);
                                                                return;
                                                        }
							var ticket_email_data = {
								title : "USC SCIA ticket email",
								email : "mgendott@usc.edu",
								ticket_token : ticket_numbers,
								total_price : charge_total/100
							 };
							utils.log(ticket_email_data);	
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
                                                });
				 }); // end async parallel
			} else {
				utils.sendError(res, 10101);
			}
		});
	} else if(non_member_tickets.length>0) {
		async.parallel(
			non_member_tickets, 
			function(err, result){
			 // ensure there were no failures in the db transactions
			 var transactionResult = utils.verifyDbWrites(result);
			 if (transactionResult == 11000) {
				 utils.sendError(res, 10002);
				 return;
			 }
			 else if(transactionResult != 0){
				 utils.sendError(res, 10001);
				 return;
			 }
		
			var ticket_numbers = [];	
			var event_name = "Error";
			var price = 0;
			var transportation = 0;
			for(var i=0;i<result.length;i++) {
				utils.log(result[i]);
				if(result[i].dbRes.length>0 && result[i].dbRes[0].name){
					event_name = result[i].dbRes[0].name;
					if(result[i].dbRes[0].non_member_price){
						price = result[i].dbRes[0].non_member_price;
					} else {
						price = 0;
					}
					if(result[i].dbRes[0].transportation){
						transportation = result[i].dbRes[0].transportation_price;
					} else {
						transportation = 0;
					}
				} else {
					ticket_numbers.push({event:event_name,code: result[i].dbRes._id,member_id: null,transportation: result[i].transportation});

					charge_total += price;

					if(!result[i].transportation){
						charge_total-=transportation;
					}
				}
			}

			charge_total *= 100;

			utils.log(charge_total+"       "+total);

			if(charge_total != total){
				utils.sendError(res,10103);
				removeFailedTickets(result);
				return;
			}

			stripe.charges.create({ amount: charge_total,
						currency: 'USD',
						card: stripe_token},
				function(error,results){
					if(error){
						utils.log(error);
						utils.sendError(res,10102);
						removeFailedTickets(result);
						return;
					}
					var ticket_email_data = {
						title : "USC SCIA ticket email",
						email : "mgendott@usc.edu",
						ticket_token : ticket_numbers,
						total_price : charge_total/100
					 };
					utils.log(ticket_email_data);	
					try {
						res.render('email-templates/ticket_email', ticket_email_data, function(err, renderedHtml) {
							transport.sendMail({
								from : "no_reply@uscscia.com",
								to : ticket_email_data.email,
								subject : ticket_email_data.title,
								html : renderedHtml,
								charset : "UTF-8"
							}, function(error, response){
								utils.log("I'm getting hit");
								utils.log(error+"      "+response);
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
				});
		 }); // end async parallel
	} else {
		utils.sendError(res,10100);
		return;
	}
}
