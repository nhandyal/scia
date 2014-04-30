SCIA.Sidebar.purchase_event_ticket = {

    ticketPrice : -1,
    isMember : false,
    eventID : "",
    ticketType : "",

    display : function(ticketType, eventID, ticketPrice) {
        var SELF = this;

        if(!ticketType || !eventID || !ticketPrice) {
            return;
        }

        if(ticketType === "Member") {
            SELF.isMember = true;
        } else {
            SELF.isMember = false;
        }

        SELF.eventID = eventID;
        SELF.ticketPrice = ticketPrice;
        SELF.ticketType = ticketType;

        SELF._render();
        SCIA.Sidebar._expose();
    },


    _render : function() {
        var SELF = this,
            html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase(),
            scaledPurchasePrice = ((parseInt(SELF.ticketPrice, 10) * 1.029) + 0.30).toFixed(2);

        console.log(SELF.isMember);

        html += "<div>";
            html += "<div id='sidebar-buyEVT-error' class='sidebar-error'>" + SELF.ticketType + " ticket Price: $"+scaledPurchasePrice+"</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Name on card</label>";
                html += "<input id='sidebar-buyEVT-nameOnCard' class='sidebar-input' type='text' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Card number</label>";
                html += "<div>";
                    html += "<input id='sidebar-buyEVT-cSection1' class='sidebar-input element-25' type='text' maxlength='4' tabindex='2' />";
                    html += "<input id='sidebar-buyEVT-cSection2' class='sidebar-input element-25' type='text' maxlength='4' tabindex='3' />";
                    html += "<input id='sidebar-buyEVT-cSection3' class='sidebar-input element-25' type='text' maxlength='4' tabindex='4' />";
                    html += "<input id='sidebar-buyEVT-cSection4' class='sidebar-input element-25' type='text' maxlength='4' tabindex='5' />";
                    html += "<div class='clear'></div>";
                html += "</div>";
            html += "</div>";
            html += "<div>";
                html += "<div class='sidebar-input-wrapper element-50'>";
                    html += "<label class='sidebar-label'>EXP <span class='sidebar-label-smaller'>(MM/YY)</span></label>";
                    html += "<input id='sidebar-buyEVT-exp' class='sidebar-input' type='text' tabindex='6' />";
                html += "</div>";
                if(SELF.isMember) {
                    html += "<div class='sidebar-input-wrapper element-50'>";
                        html += "<label class='sidebar-label'>CVC</label>";
                        html += "<input id='sidebar-buyEVT-cvc' class='sidebar-input' tabindex='7' />";
                    html += "</div>";
                }
                else {
                    html += "<div>";
                        html += "<div class='sidebar-input-wrapper element-25 no-pad'>";
                            html += "<label class='sidebar-label'>CVC</label>";
                            html += "<input id='sidebar-buyEVT-cvc' class='sidebar-input' tabindex='7' />";
                        html += "</div>";
                        html += "<div class='sidebar-input-wrapper element-25 no-pad'>";
                            html += "<label class='sidebar-label'>Quantity</label>";
                            html += "<input id='sidebar-buyEVT-quantity' class='sidebar-input' type='text' value='1' tabindex='8' />";
                        html += "</div>";
                        html += "<div class='clear'></div>";
                    html += "</div>";
                }
                html += "<div class='clear'></div>";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.purchase_event_ticket.submit(this)'>Buy Ticket</div>";
        html += "</div>";

        $sidebar_wrapper.html(html);
    },

    _renderSuccess : function() {
        var html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase();

        html += "<div class='sidebar-error'>Welcome to the SCIA family!<br/>We'll be sending you an email shortly with your receipt.</div>";

        $sidebar_wrapper.html(html);

        // we call expose to center the element
        // this doesn't need to be done on _render() because display (higher up the chain)
        // takes care of calling _expose() for us.
        SCIA.Sidebar._expose();
        SCIA.Sidebar.refreshOnClose = true;
    },

    submit : function(callingElement) {
        var SELF = this,
            name = $("#sidebar-buyEVT-nameOnCard").val(),
            cardSection1 = $("#sidebar-buyEVT-cSection1").val(),
            cardSection2 = $("#sidebar-buyEVT-cSection2").val(),
            cardSection3 = $("#sidebar-buyEVT-cSection3").val(),
            cardSection4 = $("#sidebar-buyEVT-cSection4").val(),
            cardNumber = cardSection1+""+cardSection2+""+cardSection3+""+cardSection4,
            exp = ($("#sidebar-buyEVT-exp").val()).split("/"),
            cvc = $("#sidebar-buyEVT-cvc").val(),
            quantity = $("#sidebar-buyEVT-quantity").val() || 1;

        if(!SCIA.Sidebar._beginTransaction()) {
            return;
        }
        
        Stripe.card.createToken({
            name : name,
            number: cardNumber,
            cvc: cvc,
            exp_month: exp[0],
            exp_year: exp[1]
        }, function(status, response) {
            if(response.error) {
                SCIA.Sidebar._endTransaction();
                $("#sidebar-buyEVT-error").empty().html(response.error.message);
                return;
            }

            // we have all the bits that we need, let's submit to the scia server
            var stripeToken = response.id,
                d1Route = "/d1/checkout";

            $.post(d1Route, {
                "stripeToken" : stripeToken,
                "saveCard" : false,
                "amountAuthorized" : SELF.ticketPrice * quantity,
		"event_id" : SELF.eventID,
		"email" : decodeURIComponent(SCIA.utils.readCookie("email")),
		//"email" : "jackkwan@usc.edu",
		"ticket_count" : quantity
            }, function(resposne) {
                SCIA.Sidebar._endTransaction();

                if(resposne.status === 0) {
                    SELF._renderSuccess();
                    return;
                }
                else {
                    console.log("?");
                    $("#sidebar-buyEVT-error").empty().html(response.short_message);
                    return;
                }
            });
        });
    }

};
