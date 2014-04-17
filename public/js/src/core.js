/**
 * SCIA Site Controller
 * Dependencies: jQuery 1.7.1, Handlebars
 */



// Create the SCIA Object and set SC to be an allias of SCIA
var SCIA = {},
SC = SCIA;

// Create global SCIA vars
SCIA.head = document.getElementsByTagName("head")[0];

SCIA.core = {
    init : function() {
        Stripe.setPublishableKey('pk_test_HvH0HNcaXzQcAPN8wruR6JXU');

        var queryParams = SC.utils.parseQueryString();

        if(queryParams.action == "recover") {
            var id = queryParams.id,
                token = queryParams.token;

            SC.Sidebar.reset_password.display(id, token);
        }else if(queryParams.action == "verified") {
            SC.Flash("Thanks for verifying your account!");
        }
    }
};

SCIA.logout = function() {
    console.log("did?");
    $.post("/d1/user/logout", function(response) {
        if(response.status === 0) {
            window.location = window.location.origin + window.location.pathname;
        }else {
            SCIA.Flash(response.short_message);
        }
    });
};