SCIA.ZuneView = {

	init : function(viewportWidth_tiles, viewportHeight_tiles, margin, zuneContainerId){

		var zuneElement = function(size, originX, originY){
			var element = document.createElement("div");
			element.className = "element-"+size;
			element.style.width = tile.width * size;
			element.style.height = tile.height * size;
			element.style.top = originY;
			element.style.left = originX;

			return element;
		};

		if(viewportWidth_tiles === undefined || viewportHeight_tiles === undefined || margin === undefined || zuneContainerId === undefined){
			throw "insufficient input arguments";
		}

		// calculate tile size
		var viewport = SCIA.utils.getWindowSize();
		var tile = {
			width : viewport.width / viewportWidth_tiles,
			height : viewport.width / viewportWidth_tiles
		};
		var zunePort = document.getElementById(zuneContainerId),
			renderX = 0,
			renderY = 0;


		while(renderY < viewport.height){
			while(renderX < viewport.width){
				// check if an element exists below the given coordinates
				console.log("("+renderX+","+renderY+") : "+document.elementFromPoint(renderX, renderY));
				var elementBelow = document.elementFromPoint(renderX, renderY);
				if( elementBelow !== null && elementBelow.id != zuneContainerId) {
					console.log("Element below, continuing");
					renderX += tile.width;
					console.log("final loop skip: ("+renderX+","+renderY+")");
					continue;
				}

				// pick size = [1,4] and create an appropriately sized element
				var size = Math.floor(Math.random() * 4) + 1;
				var element = new zuneElement(size, renderX, renderY);
				zunePort.appendChild(element);
				renderX += tile.width * size;
				console.log("final loop : ("+renderY+","+renderY+")");
			}
			renderY += tile.height;
			renderX = 0;
		}
	}
};
