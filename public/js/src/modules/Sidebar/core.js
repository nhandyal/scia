SCIA.Sidebar = {

    $sidebar : null,
    $sidebarLoading : null,
    $wrapper : null,
    windowDimensions : null,
    isVisible : false,
    _transactionInFlight : false,
    loadingImgAsset : "",
    refreshOnClose : false,

    init : function(wrapperID, sidebarID, loadingImgAsset) {
        var SELF = this;
        
        SELF.windowDimensions = SCIA.utils.getWindowSize();
        var windowDimensions = SELF.windowDimensions;

        if(wrapperID === "" || wrapperID === null) {
            return;
        }

        if(sidebarID === "" || sidebarID === null) {
            return;
        }

        if(loadingImgAsset === "" || loadingImgAsset === null) {
            return;
        }

        SELF.$wrapper = $("#"+wrapperID);
        var $wrapper = SELF.$wrapper;

        SELF.$sidebar = $("#"+sidebarID);
        var $sidebar = SELF.$sidebar;

        SELF.loadingImgAsset = loadingImgAsset;

        $sidebar.css("height", windowDimensions.height);

        $sidebar.on('click', '#sidebar-close', function(e) {
            SELF._hide();
        });

        console.log(wrapperID);

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
            "right" : -400
        }, 350, function() {
            SELF.isVisible = false;
            if(onCompleteCallback) {
                onCompleteCallback();
            }
            if(SELF.refreshOnClose) {
                window.location = window.location.origin + window.location.pathname;
            }
        });

        SCIA.utils.enable_scroll();
    },

    _renderBase : function() {
        var SELF = this,
            $sidebar = SELF.$sidebar,
            loadingImgAsset = SELF.loadingImgAsset,
            html = "";

        html += "<div id='sidebar-close'></div>";
        html += "<div id='sidebar-loading-wrapper'>";
            html += "<img id='sidebar-loading-icon' src='"+loadingImgAsset+"' width='50' height='50'/>";
        html += "</div>";
        html += "<div id='sidebar-mainWrapper'></div>";

        $sidebar.empty().html(html);

        return $("#sidebar-mainWrapper");
    },

    /**
     * mark the beginning of a network transaction for the sidebar
     * also brings up the processing screen for the UI
     * 
     * @return - true, it's OK to begin a transaction
     * @return - false, there is already another network transaction in process
     */
    _beginTransaction : function() {
        var SELF = this;

        if(SELF._transactionInFlight) {
            return false;
        }

        SELF._transactionInFlight = true;
        $("#sidebar-loading-wrapper").show().animate({"opacity" : 1}, 300, function(){});
        return true;
    },

    _endTransaction : function() {
        var SELF = this;

        SELF._transactionInFlight = false;
        $("#sidebar-loading-wrapper").hide();
        $("#sidebar-loading-wrapper").css({"opacity" : 0});
    }
};