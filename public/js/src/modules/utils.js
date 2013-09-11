SCIA.utils = {
	getWindowSize : function(){
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	},

	getGCD : function(a, b){
		var remainder = -1,
			larger = 0,
			smaller = 0;

		while(remainder !== 0){
			larger = a > b ? a : b;
			smaller = a > b ? b : a;

			remainder = larger%smaller;
			if (a > b){
				a = remainder;
			}
			else{
				b = remainder;
			}
		}

		return smaller;
	}
};
