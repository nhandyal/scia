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
    },

    /**
     * Transparently write to local storage if available
     * there are no guarantees of a successful write.
     */
    writeToLocalStorage : function(key, value) {
        if(typeof(localStorage) === "undefined" || key === null || value === null) {
            return null;
        }

        localStorage.setItem(key, value);
    },

    /**
     *
     */
    readFromLocalStorage : function(key) {
        if(typeof(localStorage) === "undefined" || key === null) {
            return null;
        }

        return localStorage.getItem(key);
    },


    getFriendlyDateTime : function(date) {
        var now = new Date(),
            weekday=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            beginToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
            beginTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0),
            endTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 0, 0, 0, 0);

        var dateString = "";
        if(date > beginToday && date <= beginTomorrow) {
            dateString = "Today, ";
        } else if(date > beginTomorrow && date <= endTomorrow) {
            dateString = "Tomorrow, ";
        } else {
            dateString = weekday[date.getDay()] + ", ";
        }

        dateString += month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

        var timeString = "",
            hour = null,
            minutes = null;
        if(date.getHours() < 12) {
            hour = date.getHours();
            minutes = date.getMinutes() / 10 > 1 ? date.getMinutes() : "0" + date.getMinutes();

            timeString = hour + ":" + minutes + "am";
        }else {
            hour = date.getHours() - 12;
            minutes = date.getMinutes() / 10 > 1 ? date.getMinutes() : "0" + date.getMinutes();

            timeString = hour + ":" + minutes + "pm";
        }

        return {
            event_date : dateString,
            event_time : timeString
        };
    }
};
