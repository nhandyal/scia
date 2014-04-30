/*!
 * SCIA site controller
 */
(function(window) {
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
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());


    SCIA.core = {
        init: function() {
            Stripe.setPublishableKey('pk_test_HvH0HNcaXzQcAPN8wruR6JXU');

            // set the page width and display

            var queryParams = SC.utils.parseQueryString();

            if (queryParams.action == "recover") {
                var id = queryParams.id,
                    token = queryParams.token;

                SC.Sidebar.reset_password.display(id, token);
            } else if (queryParams.action == "verified") {
                SC.Flash("Thanks for verifying your account!");
            }
        }
    };

    SCIA.logout = function() {
        console.log("did?");
        $.post("/d1/user/logout", function(response) {
            if (response.status === 0) {
                window.location = window.location.origin + window.location.pathname;
            } else {
                SCIA.Flash(response.short_message);
            }
        });
    };
    SCIA.Flash = function(flashMessage) {

        var SELF = this,
            windowDimensions = SCIA.utils.getWindowSize(),
            html = "<div id='scia-flash-message'>" + flashMessage + "</div>";

        $("body").append(html);
        var $flashMessage = $("#scia-flash-message");


        // we need to set the display : inline block prop to allow us to
        // get the actual element width
        $flashMessage.css({
            "display": "inline-block"
        });


        var flashMessageWidth = $flashMessage.width(),
            positionLeft = (windowDimensions.width - flashMessageWidth) / 2;



        $flashMessage.css({
            "position": "absolute",
            "top": "35px",
            "left": positionLeft,
            "padding-left": "50px",
            "padding-right": "50px",
            "text-align": "center",
            "background": "red",
            "line-height": "25px",
            "font-size": "14px"
        });

        setTimeout(function() {
            $flashMessage.remove();
        }, 5000);

    };
    SCIA.Sidebar = {

        $sidebar: null,
        $sidebarLoading: null,
        $wrapper: null,
        windowDimensions: null,
        isVisible: false,
        _transactionInFlight: false,
        loadingImgAsset: "",
        refreshOnClose: false,

        init: function(wrapperID, sidebarID, loadingImgAsset) {
            var SELF = this;

            SELF.windowDimensions = SCIA.utils.getWindowSize();
            var windowDimensions = SELF.windowDimensions;

            if (wrapperID === "" || wrapperID === null) {
                return;
            }

            if (sidebarID === "" || sidebarID === null) {
                return;
            }

            if (loadingImgAsset === "" || loadingImgAsset === null) {
                return;
            }

            SELF.$wrapper = $("#" + wrapperID);
            var $wrapper = SELF.$wrapper;

            SELF.$sidebar = $("#" + sidebarID);
            var $sidebar = SELF.$sidebar;

            SELF.loadingImgAsset = loadingImgAsset;

            $sidebar.css("height", windowDimensions.height);

            $sidebar.on('click', '#sidebar-close', function(e) {
                SELF._hide();
            });

            console.log(wrapperID);

            // listen for the esc key
            $(document).keyup(function(e) {
                if (e.keyCode == 27) {
                    SELF._hide();
                }
            });
        },

        _expose: function(onCompleteCallback) {
            var SELF = this,
                wrapperLeft = -(SELF.windowDimensions.width * 0.20),
                sidebarWidth = SELF.windowDimensions.width * 0.20;

            // vertically position the sidebar-mainWrapper
            var sidebarHeight = $("#sidebar-mainWrapper").height(),
                positionTop = (SELF.windowDimensions.height - sidebarHeight) / 3;

            $("#sidebar-mainWrapper").css({
                "top": positionTop
            });

            if (SELF.isVisible) {
                if (onCompleteCallback) {
                    onCompleteCallback();
                }
            }

            SELF.$wrapper.animate({
                "left": wrapperLeft
            }, 350, function() {
                // animation done callback
            });

            SELF.$sidebar.animate({
                "right": 0
            }, 350, function() {
                SELF.isVisible = true;
                if (onCompleteCallback) {
                    onCompleteCallback();
                }
            });

            SCIA.utils.disable_scroll();
        },

        _hide: function(onCompleteCallback) {
            var SELF = this;

            if (!SELF.isVisible) {
                if (onCompleteCallback) {
                    onCompleteCallback();
                }
            }

            SELF.$wrapper.animate({
                "left": 0
            }, 350, function() {
                // animation done callback
            });

            SELF.$sidebar.animate({
                "right": -400
            }, 350, function() {
                SELF.isVisible = false;
                if (onCompleteCallback) {
                    onCompleteCallback();
                }
                if (SELF.refreshOnClose) {
                    window.location = window.location.origin + window.location.pathname;
                }
            });

            SCIA.utils.enable_scroll();
        },

        _renderBase: function() {
            var SELF = this,
                $sidebar = SELF.$sidebar,
                loadingImgAsset = SELF.loadingImgAsset,
                html = "";

            html += "<div id='sidebar-close'></div>";
            html += "<div id='sidebar-loading-wrapper'>";
            html += "<img id='sidebar-loading-icon' src='" + loadingImgAsset + "' width='50' height='50'/>";
            html += "</div>";
            html += "<div id='sidebar-mainWrapper'></div>";

            $sidebar.empty().html(html);

            return $("#sidebar-mainWrapper");
        },

        /**
         * mark the beginning of a network transaction for the sidebar
         * also brings up the processing screen for the UI
         *
         * @return - true, it's OK to begin a transaction
         * @return - false, there is already another network transaction in process
         */
        _beginTransaction: function() {
            var SELF = this;

            if (SELF._transactionInFlight) {
                return false;
            }

            SELF._transactionInFlight = true;
            $("#sidebar-loading-wrapper").show().animate({
                "opacity": 1
            }, 300, function() {});
            return true;
        },

        _endTransaction: function() {
            var SELF = this;

            SELF._transactionInFlight = false;
            $("#sidebar-loading-wrapper").hide();
            $("#sidebar-loading-wrapper").css({
                "opacity": 0
            });
        }
    };
    SCIA.Sidebar.forgot_password = {

        display: function() {
            this._render();
            SCIA.Sidebar._expose();
        },

        _render: function() {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div>";
            html += "<div id='sidebar-fgPwd-error' class='sidebar-error'></div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label' for='LoginEmail'>Registered Email</label>";
            html += "<input id='sidebar-fgPwd-email' class='sidebar-input' type='email' name='LoginEmail' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.forgot_password.submit(this)'>Send Email</div>";
            html += "</div>";

            $sidebar_wrapper.html(html);
        },

        _renderSuccess: function() {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div class='sidebar-error'>Awesome, you're almost there!<br/>Check your email for further instructions</div>";

            $sidebar_wrapper.html(html);

            // we call expose to center the element
            // this doesn't need to be done on _render() because display (higher up the chain)
            // takes care of calling _expose() for us.
            SCIA.Sidebar._expose();
        },

        submit: function(callingElement) {
            var SELF = this,
                email = $("#sidebar-fgPwd-email").val(),
                cb = window.location.origin + window.location.pathname,
                recoverLink = "/d1/user/recover?email=" + email + "&cb=" + cb;

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            $.get(recoverLink, function(response) {

                SCIA.Sidebar._endTransaction();

                if (response.status === 0) {
                    SELF._renderSuccess();
                } else if (response.status == 10402) {
                    $("#sidebar-fgPwd-error").empty().html("This email isn't registered");
                }
            });

        }
    };
    SCIA.Sidebar.login = {

        display: function() {
            this._render();
            SCIA.Sidebar._expose();
        },

        _render: function() {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div>";
            html += "<div id='sidebar-login-error' class='sidebar-error'></div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label' for='LoginEmail'>Email</label>";
            html += "<input id='sidebar-loginEmail' class='sidebar-input' type='email' name='LoginEmail' value='' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label' for='LoginPassword'>Password</label>";
            html += "<input id='sidebar-loginPassword' class='sidebar-input' type='password' name='LoginPassword' value='' tabindex='2' />";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.login.submit(this)'>login</div>";
            html += "<a class='sidebar-ui-link' href='javascript:SC.Sidebar.forgot_password.display()'>Forgot Password?</a>";
            html += "</div>";

            $sidebar_wrapper.html(html);

        },

        submit: function(callingElement) {
            var email = $("#sidebar-loginEmail").val(),
                password = $("#sidebar-loginPassword").val();

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            $.post("/d1/user/login", {
                "email": email,
                "pwd": password
            }, function(response) {

                SCIA.Sidebar._endTransaction();

                if (response.status === 0) {
                    // all good, close the login box and refresh the page
                    SCIA.Sidebar._hide(function() {
                        window.location = window.location.origin + window.location.pathname;
                    });
                } else if (response.status == 10402) {
                    $("#sidebar-login-error").empty().html("This email isn't registered");
                } else if (response.status == 10050) {
                    $("#sidebar-login-error").empty().html("Invalid password");
                } else if (response.status == 10051) {
                    $("#sidebar-login-error").empty().html("This account hasn't been verified<br/><a class='sidebar-ui-link' href=\"javascript:SC.Sidebar.resend_verification_email._submit(\'" + email + "\')\">Resend verification email?</a>");
                }

            });
        }

    };
    SCIA.Sidebar.purchase_event_ticket = {

        ticketPrice: -1,
        isMember: false,
        eventID: "",
        ticketType: "",

        display: function(ticketType, eventID, ticketPrice) {
            var SELF = this;

            if (!ticketType || !eventID || !ticketPrice) {
                return;
            }

            if (ticketType === "Member") {
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


        _render: function() {
            var SELF = this,
                html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase(),
                scaledPurchasePrice = ((parseInt(SELF.ticketPrice, 10) * 1.029) + 0.30).toFixed(2);

            console.log(SELF.isMember);

            html += "<div>";
            html += "<div id='sidebar-buyEVT-error' class='sidebar-error'>" + SELF.ticketType + " ticket Price: $" + scaledPurchasePrice + "</div>";
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
            if (SELF.isMember) {
                html += "<div class='sidebar-input-wrapper element-50'>";
                html += "<label class='sidebar-label'>CVC</label>";
                html += "<input id='sidebar-buyEVT-cvc' class='sidebar-input' tabindex='7' />";
                html += "</div>";
            } else {
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
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.purchase_membership.submit(this)'>Buy Ticket</div>";
            html += "</div>";

            $sidebar_wrapper.html(html);
        },

        _renderSuccess: function() {
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

        submit: function(callingElement) {
            var SELF = this,
                name = $("#sidebar-buyEVT-nameOnCard").val(),
                cardSection1 = $("#sidebar-buyEVT-cSection1").val(),
                cardSection2 = $("#sidebar-buyEVT-cSection2").val(),
                cardSection3 = $("#sidebar-buyEVT-cSection3").val(),
                cardSection4 = $("#sidebar-buyEVT-cSection4").val(),
                cardNumber = cardSection1 + "" + cardSection2 + "" + cardSection3 + "" + cardSection4,
                exp = ($("#sidebar-buyEVT-exp").val()).split("/"),
                cvc = $("#sidebar-buyEVT-cvc").val(),
                quantity = $("#sidebar-buyEVT-quantity").val() || 1;

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            Stripe.card.createToken({
                name: name,
                number: cardNumber,
                cvc: cvc,
                exp_month: exp[0],
                exp_year: exp[1]
            }, function(status, response) {
                if (response.error) {
                    SCIA.Sidebar._endTransaction();
                    $("#sidebar-buyEVT-error").empty().html(response.error.message);
                    return;
                }

                // we have all the bits that we need, let's submit to the scia server
                var stripeToken = response.id,
                    d1Route = "/d1/user/" + SCIA.utils.readCookie('id') + "/buyEVTembership";

                $.post(d1Route, {
                    "stripeToken": stripeToken,
                    "saveCard": false,
                    "amountAuthorized": SELF.membershipPrice
                }, function(resposne) {
                    SCIA.Sidebar._endTransaction();

                    if (resposne.status === 0) {
                        SELF._renderSuccess();
                        return;
                    } else {
                        console.log("?");
                        $("#sidebar-buyEVT-error").empty().html(response.short_message);
                        return;
                    }
                });
            });
        }

    };
    SCIA.Sidebar.purchase_membership = {

        membershipPrice: -1,

        display: function() {
            this._pre_process();
            SCIA.Sidebar._expose();
        },

        _pre_process: function() {

            // before we can allow a user to buy membership, we need to do a couple things
            // 1: get the current membership price
            // 2: ensure they're a current usc student

            // since we pull the email from the auth cookie
            // it is valid to assume the user is logged in
            var SELF = this;
            email = decodeURIComponent(SCIA.utils.readCookie("email"));

            if (email === null) {
                // the client is in a weird state, logout to try and reset
                SCIA.logout();
                return;
            }
            if (email.toLowerCase().indexOf("@usc.edu") == -1) {
                SCIA.Flash("Drats, you have to have an @usc.edu email<br/>to buy membership.");
                return;
            }

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            $.get("/d1/membership", function(response) {
                SCIA.Sidebar._endTransaction();

                if (response.status !== 0) {
                    SCIA.Flash("Bugger, looks like something is broken.<br/>Try again later");
                    SCIA.Sidebar._hide();
                }

                SELF.membershipPrice = response.data.price;
                SELF._render();
                SCIA.Sidebar._expose();
            });
        },

        _render: function() {
            var SELF = this,
                html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase(),
                scaledPurchasePrice = ((parseInt(SELF.membershipPrice, 10) * 1.029) + 0.30).toFixed(2);

            html += "<div>";
            html += "<div id='sidebar-buyM-error' class='sidebar-error'>Current Membership Price: $" + scaledPurchasePrice + "</div>";
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

        _renderSuccess: function() {
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

        submit: function(callingElement) {
            var SELF = this,
                name = $("#sidebar-buyM-nameOnCard").val(),
                cardSection1 = $("#sidebar-buyM-cSection1").val(),
                cardSection2 = $("#sidebar-buyM-cSection2").val(),
                cardSection3 = $("#sidebar-buyM-cSection3").val(),
                cardSection4 = $("#sidebar-buyM-cSection4").val(),
                cardNumber = cardSection1 + "" + cardSection2 + "" + cardSection3 + "" + cardSection4,
                exp = ($("#sidebar-buyM-exp").val()).split("/"),
                cvc = $("#sidebar-buyM-cvc").val(),
                remember_card = $("#sidebar-buyM-rememberCard").is(":checked");

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            Stripe.card.createToken({
                name: name,
                number: cardNumber,
                cvc: cvc,
                exp_month: exp[0],
                exp_year: exp[1]
            }, function(status, response) {
                if (response.error) {
                    SCIA.Sidebar._endTransaction();
                    $("#sidebar-buyM-error").empty().html(response.error.message);
                    return;
                }

                // we have all the bits that we need, let's submit to the scia server
                var stripeToken = response.id,
                    d1Route = "/d1/user/" + SCIA.utils.readCookie('id') + "/buyMembership";

                $.post(d1Route, {
                    "stripeToken": stripeToken,
                    "saveCard": remember_card,
                    "amountAuthorized": SELF.membershipPrice
                }, function(resposne) {
                    SCIA.Sidebar._endTransaction();

                    if (resposne.status === 0) {
                        SELF._renderSuccess();
                        return;
                    } else {
                        console.log("?");
                        $("#sidebar-buyM-error").empty().html(response.short_message);
                        return;
                    }
                });
            });
        }

    };
    SCIA.Sidebar.register = {

        display: function() {
            this._render();
            SCIA.Sidebar._expose();
        },

        _render: function() {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div>";
            html += "<div id='sidebar-register-error' class='sidebar-error'></div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label'>First Name</label>";
            html += "<input id='sidebar-register-fname' class='sidebar-input' type='text' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label'>Last Name</label>";
            html += "<input id='sidebar-register-lname' class='sidebar-input' type='text' tabindex='2' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label'>Email <span class='sidebar-label-smaller'>(@usc.edu required for membership)</span></label>";
            html += "<input id='sidebar-register-email' class='sidebar-input' type='email' tabindex='3' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label'>Password</label>";
            html += "<input id='sidebar-register-password' class='sidebar-input' type='password' tabindex='4' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label'>Confirm Password</label>";
            html += "<input id='sidebar-register-password-conf' class='sidebar-input' type='password' tabindex='5' />";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.register.submit(this)'>Register</div>";
            html += "</div>";

            $sidebar_wrapper.html(html);
        },

        _renderSuccess: function() {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div class='sidebar-error'>Awesome, you're almost there!<br/>Check your email for further instructions</div>";

            $sidebar_wrapper.html(html);

            // we call expose to center the element
            // this doesn't need to be done on _render() because display (higher up the chain)
            // takes care of calling _expose() for us.
            SCIA.Sidebar._expose();
        },

        submit: function(callingElement) {
            var SELF = this,
                fname = $("#sidebar-register-fname").val(),
                lname = $("#sidebar-register-lname").val(),
                email = $("#sidebar-register-email").val(),
                pwd = $("#sidebar-register-password").val(),
                pwd_conf = $("#sidebar-register-password-conf").val();

            // ensure all fields have been submitted
            if (fname === "" || lname === "" || email === "" || pwd === "" || pwd_conf === "") {
                $("#sidebar-register-error").empty().html("All fields are required");
                return;
            }

            // validate email
            if (email.indexOf("@") == -1) {
                $("#sidebar-register-error").empty().html("Invalid email");
                return;
            }

            // make sure passwords match
            if (pwd != pwd_conf) {
                $("#sidebar-register-error").empty().html("passwords don't match");
                return;
            }

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            // everything looks good, let's submit to the server
            $.post("/d1/user/create", {
                "f_name": fname,
                "l_name": lname,
                "email": email,
                "pwd": pwd,
                "cb": window.location.origin + window.location.pathname
            }, function(response) {

                SCIA.Sidebar._endTransaction();

                if (response.status === 0) {
                    SELF._renderSuccess();
                    return;
                } else if (response.status == 10001) {
                    $("#sidebar-register-error").empty().html("This email is already registered.<br/><a class='sidebar-ui-link' href='javascript:SC.Sidebar.forgot_password.display()'>Forgot Password?</a>");
                    return;
                } else if (response.status == 10501) {
                    $("#sidebar-register-error").empty().html("UhOh, we messed something up.<br/>Try again later.");
                    return;
                } else {
                    $("#sidebar-register-error").empty().html(response.short_message);
                    return;
                }

            });
        }

    };
    SCIA.Sidebar.resend_verification_email = {

        _submit: function(email) {
            var SELF = this;

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            $.post("/d1/user/resendVerificationEmail", {
                "email": email,
                "cb": window.location.origin + window.location.pathname
            }, function(response) {

                SCIA.Sidebar._endTransaction();

                if (response.status === 0) {
                    SELF._render("Awesome, you're almost there!<br/>Check your email for further instructions");
                    return;
                } else {
                    SELF._render(response.short_message);
                    return;
                }

            });


        },

        _render: function(message) {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div class='sidebar-error'>" + message + "</div>";

            $sidebar_wrapper.html(html);

            // we call expose to center the element
            // this doesn't need to be done on _render() because display (higher up the chain)
            // takes care of calling _expose() for us.
            SCIA.Sidebar._expose();
        }

    };
    SCIA.reset_password = {

        id: "",
        token: "",

        display: function(id, token) {
            this.id = id;
            this.token = token;
            this._render();
            SCIA.Sidebar._expose();
        },

        _render: function() {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div id='sidebar-reset-pwd'>";
            html += "<div id='sidebar-rstPwd-error' class='sidebar-error'></div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label'>New Password</label>";
            html += "<input id='sidebar-new-password' class='sidebar-input' type='password' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
            html += "<label class='sidebar-label'>Confirm Password</label>";
            html += "<input id='sidebar-new-password-conf' class='sidebar-input' type='password' tabindex='2' />";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.reset_password.submit(this)'>Reset Password</div>";
            html += "</div>";

            $sidebar_wrapper.html(html);

        },

        _renderSuccess: function() {
            var html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div class='sidebar-error'>Your password has been reset :-)</div>";

            $sidebar_wrapper.html(html);

            // we call expose to center the element
            // this doesn't need to be done on _render() because display (higher up the chain)
            // takes care of calling _expose() for us.
            SCIA.Sidebar._expose();
        },

        submit: function(callingElement) {
            var SELF = this,
                new_pwd = $("#sidebar-new-password").val(),
                conf_new_pwd = $("#sidebar-new-password-conf").val(),
                id = SELF.id,
                token = SELF.token;

            if (new_pwd === "") {
                $("#sidebar-rstPwd-error").empty().html("Invalid password");
                return;
            }
            if (new_pwd != conf_new_pwd) {
                $("#sidebar-rstPwd-error").empty().html("The passwords don't match");
                return;
            }

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            $.post("/d1/user/reset", {
                "id": id,
                "token": token,
                "new_pwd": new_pwd
            }, function(response) {

                SCIA.Sidebar._endTransaction();

                if (response.status === 0) {
                    SELF._renderSuccess();
                } else {
                    $("#sidebar-rstPwd-error").empty().html(response.short_message);
                }
            });
        }

    };
    SCIA.ZuneView = {

        zuneCards: [],

        init: function(viewportTiles, zuneContainerId, zuneWrapperID) {

            var SELF = this;

            function nextChar(c) {
                return String.fromCharCode(c.charCodeAt(0) + 1);
            }

            function ZuneElement(size, originX, originY) {
                var flipContainer = document.createElement("div"),
                    flipper = document.createElement("div"),
                    front = document.createElement("div"),
                    back = document.createElement("div"),
                    imgFront = document.createElement("img"),
                    imgBack = document.createElement("img"),
                    dimension = size * tile.width;

                flipContainer.className = "flip-container";
                flipContainer.style.width = dimension;
                flipContainer.style.height = dimension;
                flipContainer.style.top = originY;
                flipContainer.style.left = originX;

                flipper.className = "flipper";

                front.className = "front";

                back.className = "back";

                imgFront.className = "imgFront zuneImg";
                imgFront.width = dimension - 5;
                imgFront.height = dimension - 5;
                imgFront.src = SELF.getRandomImg();

                imgBack.className = "imgBack zuneImg";
                imgBack.width = dimension - 5;
                imgBack.height = dimension - 5;
                imgBack.src = SELF.getRandomImg();

                front.appendChild(imgFront);
                back.appendChild(imgBack);

                flipper.appendChild(front);
                flipper.appendChild(back);

                flipContainer.appendChild(flipper);

                var zuneCard = new SELF.ZuneCard(flipContainer, imgFront, imgBack);
                SELF.zuneCards.push(zuneCard);

                return flipContainer;
            }

            var zuneContainer = document.getElementById(zuneContainerId);
            var viewport = {
                width: zuneContainer.clientWidth,
                height: zuneContainer.clientHeight
            },
                tile = {
                    width: viewport.height / viewportTiles.height,
                    height: viewport.height / viewportTiles.height
                },
                gridChar = "A",

                renderX = 0,
                renderY = 0,
                element = null;
            viewportTiles.width = Math.floor(viewport.width / tile.width);

            //var Xoffset = (viewport.width-(viewportTiles.width * tile.width))/2;
            var Xoffset = 0;
            var grid = new Array(viewportTiles.width);
            for (c = 0; c < viewportTiles.width; c++) {
                grid[c] = new Array(viewportTiles.height);
            }


            /* Used to ensure proper logo placement and size */
            var firstIteration = true;

            document.getElementById(zuneWrapperID).style.width = viewportTiles.width * tile.width + "px";
            SCIA.utils.writeToLocalStorage("pageWidth", viewportTiles.width * tile.width);

            // iterate over the entire grid
            for (r = 0; r < viewportTiles.height; r++) {
                for (c = 0; c < viewportTiles.width; c++) {

                    // find the first open slot in the grid
                    if (grid[c][r] !== undefined) {
                        // something exists at this grid location, continue
                        continue;
                    }

                    var size = Math.floor(Math.random() * 4) + 2,
                        gridX = c,
                        gridY = r,
                        trueSize = 0;


                    if (firstIteration)
                        size = 2;

                    // find the true size of the element
                    // check both the upper and lower bounds
                    while (trueSize < size && gridX < viewportTiles.width && grid[gridX][r] === undefined && gridY < viewportTiles.height) {
                        trueSize++;
                        gridX++;
                        gridY++;
                    }

                    // fill the true size square on the minimap
                    for (gridX = c; gridX < c + trueSize; gridX++) {
                        for (gridY = r; gridY < r + trueSize; gridY++) {
                            grid[gridX][gridY] = gridChar;
                        }
                    }

                    // we know the true size of the element, as well as the start location of where to render it
                    renderX = c * tile.width + Xoffset;
                    renderY = r * tile.height;
                    element = new ZuneElement(trueSize, renderX, renderY);
                    if (firstIteration) {
                        var zuneCard = SELF.zuneCards[0];
                        zuneCard.imgFront.src = "../assets/images/logo.png";
                        zuneCard.imgBack.src = "../assets/images/logo.png";
                        SELF.zuneCards = [];
                        firstIteration = false;
                    }

                    zuneContainer.appendChild(element);
                    gridChar = nextChar(gridChar);
                }
            }


            setInterval(function() {
                SELF.updateZuneImgs();
            }, 5000);


            /* PRINTS THE MINIMAP, for dev use only */
            /*
		for(var r = 0; r < viewportTiles.height; r++) {
			var line = "";
			for(var c = 0; c < viewportTiles.width; c++) {
				line += grid[c][r] + " ";
			}
			console.log(line);
		}
		*/
        },

        getRandomImg: function() {
            var imgNumber = Math.floor(Math.random() * 47);
            return "../assets/images/" + imgNumber + ".jpg";
        },

        updateZuneImgs: function() {
            // pick a random zune tile and random new img
            var selectionIndex = Math.floor(Math.random() * this.zuneCards.length);
            var zuneCard = this.zuneCards[selectionIndex];
            var SELF = this;

            if (zuneCard.frontVisible) {
                // front --> back transition
                zuneCard.imgBack.src = SELF.getRandomImg();
            } else {
                // back --> front transition
                zuneCard.imgFront.src = SELF.getRandomImg();
            }

            zuneCard.frontVisible = !zuneCard.frontVisible;
            zuneCard.flipContainer.classList.toggle("flip");
        },

        ZuneCard: function(flipContainer, imgElementFront, imgElementBack) {
            return {
                flipContainer: flipContainer,
                imgFront: imgElementFront,
                imgBack: imgElementBack,
                frontVisible: true
            };
        }
    };

    SCIA.navigation = {

        init: function() {
            // initialize the navigation bar
            if (SCIA.utils.readCookie("id") !== null) {
                var name = SCIA.utils.readCookie("f_name") + " " + SCIA.utils.readCookie("l_name"),
                    email = decodeURIComponent(SCIA.utils.readCookie("email"));

                $("#nav-personal > span").html(name);

                $("#nav-register").remove();
                $("#nav-login").remove();

                // let's do a bit more validation and remove the buy membership
                // field if the user isn't a USC student
                if (email.toLowerCase().indexOf("@usc.edu") == -1) {
                    $("#nav-buy-membership").remove();
                }

                // if the user is already a member, let's remove the buy membership field
                if (SCIA.utils.readCookie("is_member") == "true") {
                    $("#nav-buy-membership").remove();
                }
            } else {
                $("#nav-personal").remove();
            }

            $("#navigation").animate({
                "opacity": 1
            }, 0, function() {});

            // highlight the current view
            var pathname = window.location.pathname;
            console.log(pathname);
            if (pathname.indexOf('/about/') > -1) {
                $("#nav-about > a").css("color", "rgb(204,40,40)");
            } else if (pathname.indexOf('/events/') > -1) {
                $("#nav-events > a").css("color", "rgb(204,40,40)");
            } else {
                console.log("do nothing");
            }
        }

    };
    SCIA.parallax = {

        parallaxTiles: null,
        busy: false,
        rate: 0.5,

        init: function(rate, parallaxClass) {
            var SELF = this,
                parallaxElements = document.getElementsByClassName(parallaxClass);

            this.rate = (rate <= 1 && rate > 0) ? rate : 0.5;
            this.parallaxTiles = [parallaxElements.length];

            for (var i = 0; i < parallaxElements.length; i++) {
                this.parallaxTiles[i] = this.ParallaxTile(parallaxElements[i]);
            }

            // Register scroll listeners
            $(window).scroll(function(e) {
                SELF.requestFrameUpdate();
            });
        },

        requestFrameUpdate: function() {
            var SELF = this;
            if (!this.busy) {
                requestAnimationFrame(function() {
                    SELF.updateParallax();
                });
                this.busy = true;
            }
        },

        updateParallax: function() {
            for (var i = 0; i < this.parallaxTiles.length; i++) {
                this.parallaxTiles[i].render();
            }
            this.busy = false;
        },


        /*
         * ParallaxTile factory
         */
        ParallaxTile: function(parallaxDOMElement) {
            var internals = function(parallax) {

                this.parallaxDOMElement = parallaxDOMElement;
                this.offset = new parallax.Offset(this.parallaxDOMElement);

                var transformAnchorY = Math.floor(parallax.rate * window.innerHeight);

                this.render = function() {
                    this.offset.update();

                    // This is where the parallax magic happens
                    if (this.offset.visible) {
                        var relativeTransformY = transformAnchorY + (parallax.rate * this.offset.edgeTopOffset);

                        $(this.parallaxDOMElement).css("background-position-y", relativeTransformY);
                    }
                };

            },

                _temp = new internals(this);

            // initialize the element to its correct initial position
            _temp.render();

            return _temp;
        },

        /*
         * For a detailed description of what these values represent check out docs/parallax/elementOffsets
         * To see if an element is in view edgeTopOffset < 0 && edgeBottomOffset > 0
         */
        Offset: function(DOMElement) {
            if (DOMElement === null)
                return null;

            var elementHeight = $(DOMElement).height(),
                absoluteEdgeTop = $(DOMElement).offset().top,
                absoluteEdgeBottom = absoluteEdgeTop + elementHeight;

            this.scrollOffset = 0;
            this.edgeTopOffset = 0;
            this.edgeBottomOffset = 0;
            this.visible = false;

            this.update = function() {
                var scrollPosition = $(window).scrollTop();

                this.scrollOffset = absoluteEdgeTop - scrollPosition;
                this.edgeTopOffset = absoluteEdgeTop - (scrollPosition + window.innerHeight);
                this.edgeBottomOffset = absoluteEdgeBottom - scrollPosition;
                this.visible = this.edgeTopOffset < 0 && this.edgeBottomOffset > 0;
            };

            return this;
        }
    };
    SCIA.utils = {

        keys: [37, 38, 39, 40],

        preventDefault: function(e) {
            e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        },

        keydown: function(e) {
            var SELF = SCIA.utils,
                keys = SELF.keys;

            for (var i = keys.length; i--;) {
                if (e.keyCode === keys[i]) {
                    SELF.preventDefault(e);
                    return;
                }
            }
        },

        wheel: function(e) {
            var SELF = SCIA.utils;

            SELF.preventDefault(e);
        },

        disable_scroll: function() {
            var SELF = SCIA.utils,
                wheel = this.wheel,
                keydown = this.keydown;

            if (window.addEventListener) {
                window.addEventListener('DOMMouseScroll', wheel, false);
            }
            window.onmousewheel = document.onmousewheel = wheel;
            document.onkeydown = keydown;
        },

        enable_scroll: function() {
            var SELF = SCIA.utils,
                wheel = this.wheel;

            if (window.removeEventListener) {
                window.removeEventListener('DOMMouseScroll', wheel, false);
            }
            window.onmousewheel = document.onmousewheel = document.onkeydown = null;
        },

        getWindowSize: function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },

        getGCD: function(a, b) {
            var remainder = -1,
                larger = 0,
                smaller = 0;

            while (remainder !== 0) {
                larger = a > b ? a : b;
                smaller = a > b ? b : a;

                remainder = larger % smaller;
                if (a > b) {
                    a = remainder;
                } else {
                    b = remainder;
                }
            }

            return smaller;
        },


        /**
         * parser.protocol; // => "http:"
         * parser.hostname; // => "example.com"
         * parser.port;     // => "3000"
         * parser.pathname; // => "/pathname/"
         * parser.search;   // => "?search=test"
         * parser.hash;     // => "#hash"
         * parser.host;     // => "example.com:3000"
         */
        parseURL: function(url) {
            var parser = document.createElement('a');
            parser.href = url;
            return parser;
        },

        // taken from
        // http://stackoverflow.com/a/2880929
        parseQueryString: function() {
            var match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) {
                    return decodeURIComponent(s.replace(pl, " "));
                },
                query = window.location.search.substring(1),
                urlParams = {},
                watchdog = 0;

            // the watchdog modification was necessary to make this
            // lint quality code
            while (watchdog < 30) {
                match = search.exec(query);
                if (match === null) {
                    break;
                } else {
                    urlParams[decode(match[1])] = decode(match[2]);
                }
                watchdog++;
            }

            return urlParams;
        },

        readCookie: function(cookieName) {
            var nameEQ = cookieName + "=",
                ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        },

        /**
         * Transparently write to local storage if available
         * there are no guarantees of a successful write.
         */
        writeToLocalStorage: function(key, value) {
            if (typeof(localStorage) === "undefined" || key === null || value === null) {
                return null;
            }

            localStorage.setItem(key, value);
        },

        /**
         *
         */
        readFromLocalStorage: function(key) {
            if (typeof(localStorage) === "undefined" || key === null) {
                return null;
            }

            return localStorage.getItem(key);
        },


        getFriendlyDateTime: function(date) {
            var now = new Date(),
                weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                beginToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
                beginTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0),
                endTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 0, 0, 0, 0);

            var dateString = "";
            if (date > beginToday && date <= beginTomorrow) {
                dateString = "Today, ";
            } else if (date > beginTomorrow && date <= endTomorrow) {
                dateString = "Tomorrow, ";
            } else {
                dateString = weekday[date.getDay()] + ", ";
            }

            dateString += month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

            var timeString = "",
                hour = null,
                minutes = null;
            if (date.getHours() < 12) {
                hour = date.getHours();
                minutes = date.getMinutes() / 10 > 1 ? date.getMinutes() : "0" + date.getMinutes();

                timeString = hour + ":" + minutes + "am";
            } else {
                hour = date.getHours() - 12;
                minutes = date.getMinutes() / 10 > 1 ? date.getMinutes() : "0" + date.getMinutes();

                timeString = hour + ":" + minutes + "pm";
            }

            return {
                event_date: dateString,
                event_time: timeString
            };
        }
    };

    // Initialize all the included modules

    // Expose the SCIA and SC object to the window
    if (typeof window === "object") {
        window.SCIA = window.SC = SCIA;
    }

})(window);
