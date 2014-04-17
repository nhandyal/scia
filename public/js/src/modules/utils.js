SCIA.utils = {

	keys : [37, 38, 39, 40],

    preventDefault : function(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;  
    },

    keydown : function(e) {
    	var SELF = SCIA.utils,
    		keys = SELF.keys;

        for (var i = keys.length; i--;) {
            if (e.keyCode === keys[i]) {
                preventDefault(e);
                return;
            }
        }
    },

    wheel : function(e) {
    	var SELF = SCIA.utils;

        SELF.preventDefault(e);
    },

    disable_scroll : function() {
    	var SELF = SCIA.utils,
    		wheel = this.wheel,
    		keydown = this.keydown;

        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', wheel, false);
        }
        window.onmousewheel = document.onmousewheel = wheel;
        document.onkeydown = keydown;
    },

    enable_scroll : function() {
    	var SELF = SCIA.utils,
    		wheel = this.wheel;

        if (window.removeEventListener) {
            window.removeEventListener('DOMMouseScroll', wheel, false);
        }
        window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
    },

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
