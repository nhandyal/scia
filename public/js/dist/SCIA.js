/*!
 * SCIA site controller
 */
(function(window) {

    // Create the SCIA Object and set SC to be an allias of SCIA
    var SCIA = {},
        SC = SCIA;

    // Create global SCIA vars
    SCIA.head = document.getElementsByTagName("head")[0];
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
            viewportTiles.width = Math.ceil(viewport.width / tile.width);


            var grid = new Array(viewportTiles.width);
            for (c = 0; c < viewportTiles.width; c++) {
                grid[c] = new Array(viewportTiles.height);
            }


            /* Used to ensure proper logo placement and size */
            var firstIteration = true;

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
                    renderX = c * tile.width;
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
            }, 2500);


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
