SCIA.ZuneView = {

	init : function(viewportTiles, margin, zuneContainerId){

		var minimap = (function(viewportTiles){
			
			function nextChar(c) {
				return String.fromCharCode(c.charCodeAt(0) + 1);
			}

			function ZuneElement(size, originX, originY) {

				function randomColor(){
					return Math.floor(Math.random() * 256) + 1;
				}

                var element = document.createElement("div");
                element.className = "element-" + size;
                element.style.width = tile.width * size;
                element.style.height = tile.height * size;
                element.style.top = originY;
                element.style.left = originX;
                element.style.background = "rgb("+randomColor()+","+randomColor()+","+randomColor()+")";

                return element;
            }

			var viewport = SCIA.utils.getWindowSize(),
				grid = new Array(viewportTiles.width),
				gridChar = "A",
				tile = {
					width : viewport.width / viewportTiles.width,
					height : viewport.width / viewportTiles.width
				},
				renderX = 0,
				renderY = 0,
				element = null,
				zuneContainer = document.getElementById(zuneContainerId);

			for(c = 0; c < viewportTiles.width; c++) {
				grid[c] = new Array(viewportTiles.height);
			}

			
			// iterate over the entire grid
			for(r = 0; r < viewportTiles.height; r++) {
				for(c = 0; c < viewportTiles.width; c++) {

					// find the first open slot in the grid
					if(grid[c][r] !== undefined) {
						// something exists at this grid location, continue
						continue;
					}

					var size = Math.floor(Math.random() * 4) + 1,
						gridX = c,
						gridY = r,
						trueSize = 0;

					// find the true size of the element
					while(trueSize < size && gridX < viewportTiles.width && grid[gridX][gridY] === undefined) {
						trueSize++;
						gridX++;
					}

					// fill the true size square on the grid
					for(gridX = c; gridX < c + trueSize; gridX++) {
						for(gridY = r; gridY < r + trueSize; gridY++) {
							grid[gridX][gridY] = gridChar;
						}
					}

					// we know the true size of the element, as well as the start location of where to render it
					renderX = c * tile.width;
					renderY = r * tile.height;
					element = new ZuneElement(trueSize, renderX, renderY);
					zuneContainer.appendChild(element);


					gridChar = nextChar(gridChar);
				}
			}

			return grid;
		})(viewportTiles);


		// print minimap
		for(var r = 0; r < viewportTiles.height; r++) {
			var line = "";
			for(var c = 0; c < viewportTiles.width; c++) {
				line += minimap[c][r] + " ";
			}
			console.log(line);
		}
	}
};
