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
                        window.location = "/";
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

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

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

            if (!SCIA.Sidebar._beginTransaction()) {
                return;
            }

            if (new_pwd === "") {
                $("#sidebar-rstPwd-error").empty().html("Invalid password");
                return;
            }
            if (new_pwd != conf_new_pwd) {
                $("#sidebar-rstPwd-error").empty().html("The passwords don't match");
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

        init: function(viewportTiles, zuneContainerId) {

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

            //		var Xoffset = (viewport.width-(viewportTiles.width * tile.width))/2;

            var Xoffset = 0;
            var grid = new Array(viewportTiles.width);
            for (c = 0; c < viewportTiles.width; c++) {
                grid[c] = new Array(viewportTiles.height);
            }


            /* Used to ensure proper logo placement and size */
            var firstIteration = true;

            document.getElementById("wrapper").style.width = viewportTiles.width * tile.width + "px";

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
                    preventDefault(e);
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
        }
    };

    // Initialize all the included modules

    // Expose the SCIA and SC object to the window
    if (typeof window === "object") {
        window.SCIA = window.SC = SCIA;
    }

})(window);
