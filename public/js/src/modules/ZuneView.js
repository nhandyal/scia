SCIA.ZuneView = {

	zuneImgElements : [],
	
	init : function(viewportTiles, margin, zuneContainerId){
		
		var SELF = this;

		function nextChar(c) {
			return String.fromCharCode(c.charCodeAt(0) + 1);
		}

		function ZuneElement(size, originX, originY) {

            var containingDiv = document.createElement("div");
            var displayedImg = document.createElement("img");
            
            containingDiv.style.width = tile.width * size;
            containingDiv.style.height = tile.height * size;
            containingDiv.style.top = originY;
            containingDiv.style.left = originX;

            displayedImg.src = SELF.getRandomImg();
            displayedImg.width = tile.width * size;
            displayedImg.height = tile.height * size;

            containingDiv.appendChild(displayedImg);
            SELF.zuneImgElements.push(displayedImg);

            return containingDiv;
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


		// calculate the visible number of tiles based on horizontal tiles
        viewportTiles.height = Math.ceil(viewport.height / tile.width);

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

		setInterval(function(){
			SELF.updateZuneImgs();
		}, 1200);

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

	getRandomImg : function(){
		var imgNumber = Math.floor(Math.random() * 47);
		return "../assets/images/"+imgNumber+".jpg";
	},

	updateZuneImgs : function(){
		// pick a random zune tile and random new img
		var selectionIndex = Math.floor(Math.random() * this.zuneImgElements.length);
		this.zuneImgElements[selectionIndex].src = this.getRandomImg();
	}
};
