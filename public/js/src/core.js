/**
 * SCIA Site Controller
 * Dependencies: jQuery 1.7.1, Handlebars
 */



// Create the SCIA Object and set SC to be an allias of SCIA
var SCIA = {},
SC = SCIA;

// Create global SCIA vars
SCIA.head = document.getElementsByTagName("head")[0];


/*
 * Shim for requestAnimationFrame and cancelAnimationFrame
 * Taken from Paul Irish https://gist.github.com/paulirish/1579671
 */
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());


SCIA.core = {
    init : function() {
        Stripe.setPublishableKey('pk_test_HvH0HNcaXzQcAPN8wruR6JXU');

        // set the page width and display
        var pageWidth = SCIA.utils.readFromLocalStorage("pageWidth");
        if(pageWidth !== null) {
            $("#wrapper").width(pageWidth);
        }

        $("#wrapper").show();


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