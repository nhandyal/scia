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
                SELF.preventDefault(e);
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
    parseURL : function(url) {
        var parser = document.createElement('a');
        parser.href = url;
        return parser;
    },

    // taken from
    // http://stackoverflow.com/a/2880929
    parseQueryString : function() {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1),
            urlParams = {},
            watchdog = 0;

        // the watchdog modification was necessary to make this
        // lint quality code
        while (watchdog < 30) {
            match = search.exec(query);
            if(match === null) {
                break;
            } else {
                urlParams[decode(match[1])] = decode(match[2]);
            }
            watchdog ++;
        }

        return urlParams;
    },

    readCookie : function(cookieName) {
        var nameEQ = cookieName + "=",
            ca = document.cookie.split(';');
        for(var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }
};
