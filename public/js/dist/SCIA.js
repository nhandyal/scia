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

        init: function(viewportWidth_tiles, viewportHeight_tiles, margin, zuneContainerId) {

            var minimap = (function(viewportWidth_tiles, viewportHeight_tiles) {

                function nextChar(c) {
                    return String.fromCharCode(c.charCodeAt(0) + 1);
                }

                var grid = new Array(viewportWidth_tiles);

                for (c = 0; c < viewportWidth_tiles; c++) {
                    grid[c] = new Array(viewportHeight_tiles);
                }

                var gridChar = "A";

                // iterate over the entire grid
                for (r = 0; r < viewportHeight_tiles; r++) {
                    for (c = 0; c < viewportWidth_tiles; c++) {

                        // find the first open slot in the grid
                        if (grid[c][r] !== undefined) {
                            // something exists in this grid location, continue
                            continue;
                        }

                        var size = Math.floor(Math.random() * 4) + 1,
                            gridX = c,
                            gridY = r,
                            trueSize = 0;

                        // find the true size of the element
                        while (trueSize < size && gridX < viewportWidth_tiles && grid[gridX][gridY] === undefined) {
                            trueSize++;
                            gridX++;
                        }

                        // fill the true size square on the grid
                        for (gridX = c; gridX < c + trueSize; gridX++) {
                            for (gridY = r; gridY < r + trueSize; gridY++) {
                                grid[gridX][gridY] = gridChar;
                            }
                        }

                        gridChar = nextChar(gridChar);
                    }
                }

                return grid;

            })(viewportWidth_tiles, viewportHeight_tiles);


            // print minimap
            for (var r = 0; r < viewportHeight_tiles; r++) {
                var line = "";
                for (var c = 0; c < viewportWidth_tiles; c++) {
                    line += minimap[c][r] + " ";
                }
                console.log(line);
            }
        }
    };

    SCIA.utils = {
        getWindowSize: function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    };

    // Initialize all the included modules


    // Expose the SCIA and SC object to the window
    if (typeof window === "object") {
        window.SCIA = window.SC = SCIA;
    }

})(window);
