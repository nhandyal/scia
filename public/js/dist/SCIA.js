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
    SCIA.Sidebar = {

        $sidebar: null,
        $wrapper: null,
        windowDimensions: null,


        baseTemplate: function() {
            var templateString = "";

            templateString += "<div id='sidebar-close'></div>";
            templateString += "<div id='sidebar-mainWrapper'></div>";

            return templateString;
        },

        init: function(wrapperID, sidebarID) {
            var SELF = this;

            SELF.windowDimensions = SCIA.utils.getWindowSize();
            var windowDimensions = SELF.windowDimensions;

            if (wrapperID === "" || wrapperID === null) {
                return;
            }

            if (sidebarID === "" || sidebarID === null) {
                return;
            }


            SELF.$wrapper = $("#" + wrapperID);
            var $wrapper = SELF.$wrapper;

            SELF.$sidebar = $("#" + sidebarID);
            var $sidebar = SELF.$sidebar;

            $sidebar.css("height", windowDimensions.height);

            $sidebar.on('click', '#sidebar-close', function(e) {
                SELF._hide();
            });
        },

        _expose: function(onCompleteCallback) {
            var SELF = this,
                wrapperLeft = -(SELF.windowDimensions.width * 0.20),
                sidebarWidth = SELF.windowDimensions.width * 0.20;

            SELF.$wrapper.animate({
                "left": wrapperLeft
            }, 350, function() {
                // animation done callback
            });

            SELF.$sidebar.animate({
                "right": 0
            }, 350, function() {
                if (onCompleteCallback) {
                    onCompleteCallback();
                }
            });

            SCIA.utils.disable_scroll();
        },

        _hide: function(onCompleteCallback) {
            var SELF = this;

            SELF.$wrapper.animate({
                "left": 0
            }, 350, function() {
                // animation done callback
            });

            SELF.$sidebar.animate({
                "right": -300
            }, 350, function() {
                if (onCompleteCallback) {
                    onCompleteCallback();
                }
            });

            SCIA.utils.enable_scroll();
        },

        _renderBase: function() {
            var SELF = this,
                $sidebar = SELF.$sidebar,
                html = "";

            html += "<div id='sidebar-close'></div>";
            html += "<div id='sidebar-mainWrapper'></div>";

            $sidebar.empty().html(html);

            return $("#sidebar-mainWrapper");
        },

        renderHandlerbars: function() {
            var SELF = this,
                $sidebar = SELF.$sidebar,
                baseTemplate = Handlebars.compile(SELF.baseTemplate()),
                html = baseTemplate();

            $sidebar.empty().html(html);
        },

        login: {

            display: function() {
                var SELF = this;

                SELF._render();
                SCIA.Sidebar._expose();
            },

            _render: function() {
                var SELF = this,
                    html = "",
                    $sidebar_wrapper = SCIA.Sidebar._renderBase();

                html += "<div id='sidebar-login'>";
                html += "<div id='sidebar-login-error' class='sidebar-error'></div>";
                html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidbar-label' for='LoginEmail'>Email</label>";
                html += "<input id='sidebar-loginEmail' class='sidebar-input' type='email' name='LoginEmail' value='' tabindex='1' />";
                html += "</div>";
                html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidbar-label' for='LoginPassword'>Password</label>";
                html += "<input id='sidebar-loginPassword' class='sidebar-input' type='password' name='LoginPassword' value='' tabindex='2' />";
                html += "</div>";
                html += "<div id='sidebar-login' class='sidebar-button large-button' onclick='SCIA.Sidebar.login.submit(this)'>login</div>";
                html += "<a class='sidebar-ui-link' href=''>Forgot Password?</a>";
                html += "</div>";

                $sidebar_wrapper.html(html);

            },

            submit: function(callingElement) {
                var email = $("#sidebar-loginEmail").val(),
                    password = $("#sidebar-loginPassword").val();

                $.post("/d1/user/login", {
                    "email": email,
                    "pwd": password
                }, function(response) {

                    if (response.status === 0) {
                        // all good, close the login box and refresh the page
                        SCIA.Sidebar._hide(function() {
                            location.reload();
                        });
                    } else if (response.status == 10402) {
                        $("#sidebar-login-error").empty().html("This email isn't registered");
                    } else if (response.status == 10050) {
                        $("#sidebar-login-error").empty().html("Invalid password");
                    }

                });
            }

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
        }
    };

    // Initialize all the included modules

    // Expose the SCIA and SC object to the window
    if (typeof window === "object") {
        window.SCIA = window.SC = SCIA;
    }

})(window);
