SCIA.Sidebar.purchase_membership = {

    membershipPrice : -1,

    display : function() {
        this._pre_process();
        SCIA.Sidebar._expose();
    },

    _pre_process : function() {

        // before we can allow a user to buy membership, we need to do a couple things
        // 1: get the current membership price
        // 2: ensure they're a current usc student

        // since we pull the email from the auth cookie
        // it is valid to assume the user is logged in
        var SELF = this;
            email = decodeURIComponent(SCIA.utils.readCookie("email"));

        if(email === null) {
            // the client is in a weird state, logout to try and reset
            SCIA.logout();
            return;
        }
        if(email.toLowerCase().indexOf("@usc.edu") == -1) {
            SCIA.Flash("Drats, you have to have an @usc.edu email<br/>to buy membership.");
            return;
        }

        if(!SCIA.Sidebar._beginTransaction()) {
            return;
        }

        $.get("/d1/membership", function(response) {
            SCIA.Sidebar._endTransaction();

            if(response.status !== 0) {
                SCIA.Flash("Bugger, looks like something is broken.<br/>Try again later");
                SCIA.Sidebar._hide();
            }

            SELF.membershipPrice = response.data.price;
            SELF._render();
            SCIA.Sidebar._expose();
        });
    },

    _render : function() {
        var SELF = this,
            html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase(),
            scaledPurchasePrice = ((parseInt(SELF.membershipPrice, 10) * 1.029) + 0.30).toFixed(2);

        html += "<div>";
            html += "<div id='sidebar-buyM-error' class='sidebar-error'>Current Membership Price: $"+scaledPurchasePrice+"</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Name on card</label>";
                html += "<input id='sidebar-buyM-nameOnCard' class='sidebar-input' type='text' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Card number</label>";
                html += "<div>";
                    html += "<input id='sidebar-buyM-cSection1' class='sidebar-input sidebar-card' type='text' maxlength='4' tabindex='2' />";
                    html += "<input id='sidebar-buyM-cSection2' class='sidebar-input sidebar-card' type='text' maxlength='4' tabindex='3' />";
                    html += "<input id='sidebar-buyM-cSection3' class='sidebar-input sidebar-card' type='text' maxlength='4' tabindex='4' />";
                    html += "<input id='sidebar-buyM-cSection4' class='sidebar-input sidebar-card' type='text' maxlength='4' tabindex='5' />";
                    html += "<div class='clear'></div>";
                html += "</div>";
            html += "</div>";
            html += "<div>";
                html += "<div class='sidebar-input-wrapper sidebar-input-expcvc'>";
                    html += "<label class='sidebar-label'>EXP <span class='sidebar-label-smaller'>(MM/YY)</span></label>";
                    html += "<input id='sidebar-buyM-exp' class='sidebar-input' type='text' tabindex='6' />";
                html += "</div>";
                html += "<div class='sidebar-input-wrapper sidebar-input-expcvc'>";
                    html += "<label class='sidebar-label'>CVC</label>";
                    html += "<input id='sidebar-buyM-cvc' class='sidebar-input' tabindex='7' />";
                html += "</div>";
                html += "<div class='clear'></div>";
            html += "</div>";
            html += "<label class='sidebar-label'>Remember this card </label><input id='sidebar-buyM-rememberCard' type='checkbox'/>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.purchase_membership.submit(this)'>Buy Membership</div>";
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
            name = $("#sidebar-buyM-nameOnCard").val(),
            cardSection1 = $("#sidebar-buyM-cSection1").val(),
            cardSection2 = $("#sidebar-buyM-cSection2").val(),
            cardSection3 = $("#sidebar-buyM-cSection3").val(),
            cardSection4 = $("#sidebar-buyM-cSection4").val(),
            cardNumber = cardSection1+""+cardSection2+""+cardSection3+""+cardSection4,
            exp = ($("#sidebar-buyM-exp").val()).split("/"),
            cvc = $("#sidebar-buyM-cvc").val(),
            remember_card = $("#sidebar-buyM-rememberCard").is(":checked");

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
                $("#sidebar-buyM-error").empty().html(response.error.message);
                return;
            }

            // we have all the bits that we need, let's submit to the scia server
            var stripeToken = response.id,
                d1Route = "/d1/user/"+SCIA.utils.readCookie('id')+"/buyMembership";

            $.post(d1Route, {
                "stripeToken" : stripeToken,
                "saveCard" : remember_card,
                "amountAuthorized" : SELF.membershipPrice
            }, function(resposne) {
                SCIA.Sidebar._endTransaction();

                if(resposne.status === 0) {
                    SELF._renderSuccess();
                    return;
                }
                else {
                    console.log("?");
                    $("#sidebar-buyM-error").empty().html(response.short_message);
                    return;
                }
            });
        });
    }

};