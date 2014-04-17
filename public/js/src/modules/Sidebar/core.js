SCIA.Sidebar = {

    $sidebar : null,
    $wrapper : null,
    windowDimensions : null,
    isVisible : false,


    baseTemplate : function() {
        var templateString = "";

        templateString += "<div id='sidebar-close'></div>";
        templateString += "<div id='sidebar-mainWrapper'></div>";

        return templateString;
    },

    init : function(wrapperID, sidebarID) {
        var SELF = this;
        
        SELF.windowDimensions = SCIA.utils.getWindowSize();
        var windowDimensions = SELF.windowDimensions;

        if(wrapperID === "" || wrapperID === null) {
            return;
        }

        if(sidebarID === "" || sidebarID === null) {
            return;
        }


        SELF.$wrapper = $("#"+wrapperID);
        var $wrapper = SELF.$wrapper;

        SELF.$sidebar = $("#"+sidebarID);
        var $sidebar = SELF.$sidebar;

        $sidebar.css("height", windowDimensions.height);

        $sidebar.on('click', '#sidebar-close', function(e) {
            SELF._hide();
        });

        // listen for the esc key
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { 
                SELF._hide();
            }
        });
    },

    _expose : function(onCompleteCallback) {
        var SELF = this,
            wrapperLeft = -(SELF.windowDimensions.width * 0.20),
            sidebarWidth = SELF.windowDimensions.width * 0.20;

        // vertically position the sidebar-mainWrapper
        var sidebarHeight = $("#sidebar-mainWrapper").height(),
            positionTop = (SELF.windowDimensions.height - sidebarHeight) / 3;

        $("#sidebar-mainWrapper").css({"top" : positionTop});

        if(SELF.isVisible) {
            if(onCompleteCallback) {
                onCompleteCallback();
            }
        }

        SELF.$wrapper.animate({
            "left" : wrapperLeft
        }, 350, function() {
            // animation done callback
        });

        SELF.$sidebar.animate({
            "right" : 0
        }, 350, function() {
            SELF.isVisible = true;
            if(onCompleteCallback) {
                onCompleteCallback();
            }
        });

        SCIA.utils.disable_scroll();
    },

    _hide : function(onCompleteCallback) {
        var SELF = this;

        if(!SELF.isVisible) {
            if(onCompleteCallback) {
                onCompleteCallback();
            }
        }

        SELF.$wrapper.animate({
            "left" : 0
        }, 350, function() {
            // animation done callback
        });

        SELF.$sidebar.animate({
            "right" : -300
        }, 350, function() {
            SELF.isVisible = false;
            if(onCompleteCallback) {
                onCompleteCallback();
            }
        });

        SCIA.utils.enable_scroll();
    },

    _renderBase : function() {
        var SELF = this,
            $sidebar = SELF.$sidebar,
            html = "";

        html += "<div id='sidebar-close'></div>";
        html += "<div id='sidebar-mainWrapper'></div>";

        $sidebar.empty().html(html);

        return $("#sidebar-mainWrapper");
    },

    renderHandlerbars : function() {
        var SELF = this,
            $sidebar = SELF.$sidebar,
            baseTemplate = Handlebars.compile(SELF.baseTemplate()),
            html = baseTemplate();

        $sidebar.empty().html(html);
    }
};