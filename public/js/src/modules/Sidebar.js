SCIA.Sidebar = {

    $sidebar : null,
    $wrapper : null,
    windowDimensions : null,


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
    },

    _expose : function(onCompleteCallback) {
        var SELF = this,
            wrapperLeft = -(SELF.windowDimensions.width * 0.20),
            sidebarWidth = SELF.windowDimensions.width * 0.20;

        SELF.$wrapper.animate({
            "left" : wrapperLeft
        }, 350, function() {
            // animation done callback
        });

        SELF.$sidebar.animate({
            "right" : 0
        }, 350, function() {
            if(onCompleteCallback) {
                onCompleteCallback();
            }
        });

        SCIA.utils.disable_scroll();
    },

    _hide : function(onCompleteCallback) {
        var SELF = this;

        SELF.$wrapper.animate({
            "left" : 0
        }, 350, function() {
            // animation done callback
        });

        SELF.$sidebar.animate({
            "right" : -300
        }, 350, function() {
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
    },

    login : {

        display : function() {
            var SELF = this;

            SELF._render();
            SCIA.Sidebar._expose();
        },

        _render : function() {
            var SELF = this,
                html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div id='sidebar-login'>";
                html += "<div id='sidebar-login-error' class='sidebar-error'></div>";
                html += "<div class='sidebar-input-wrapper'>";
                    html += "<label class='sidbar-label' for='LoginEmail'>Email</label>";
                    html += "<input id='sidebar-loginEmail' class='sidebar-input' type='email' name='LoginEmail' value='' tabindex='1' />";
                html += "</div>";
                html += "<div class='sidebar-input-wrapper'>";
                    html += "<label class='sidbar-label' for='LoginPassword'>Password</label>";
                    html += "<input id='sidebar-loginPassword' class='sidebar-input' type='password' name='LoginPassword' value='' tabindex='2' />";
                html += "</div>";
                html += "<div id='sidebar-login' class='sidebar-button large-button' onclick='SCIA.Sidebar.login.submit(this)'>login</div>";
                html += "<a class='sidebar-ui-link' href=''>Forgot Password?</a>";
            html += "</div>";

            $sidebar_wrapper.html(html);

        },

        submit : function(callingElement) {
            var email = $("#sidebar-loginEmail").val(),
                password = $("#sidebar-loginPassword").val();

            $.post("/d1/user/login", {
                "email" : email,
                "pwd" : password
            }, function(response) {

                if(response.status === 0) {
                    // all good, close the login box and refresh the page
                    SCIA.Sidebar._hide(function() {
                        location.reload();
                    });
                } else if(response.status == 10402) {
                    $("#sidebar-login-error").empty().html("This email isn't registered");
                } else if(response.status == 10050) {
                    $("#sidebar-login-error").empty().html("Invalid password");
                }

            });
        }

    }

};