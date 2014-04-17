SCIA.reset_password = {
    
    id : "",
    token : "",
    submit_processing : false,

    display : function(id, token) {
        this.id = id;
        this.token = token;
        this._render();
        SCIA.Sidebar._expose();
    },

    _render : function() {
        var SELF = this,
            html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase();

        html += "<div id='sidebar-reset-pwd'>";
            html += "<div id='sidebar-rstPwd-error' class='sidebar-error'></div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>New Password</label>";
                html += "<input id='sidebar-new-password' class='sidebar-input' type='password' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Confirm Password</label>";
                html += "<input id='sidebar-new-password-conf' class='sidebar-input' type='password' tabindex='2' />";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.reset_password.submit(this)'>Reset Password</div>";
        html += "</div>";

        $sidebar_wrapper.html(html);

    },

    _renderSuccess : function() {
        var SELF = this,
            html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase();

        html += "<div class='sidebar-error'>Your password has been reset :-)</div>";

        $sidebar_wrapper.html(html);

        // we call expose to center the element
        // this doesn't need to be done on _render() because display (higher up the chain)
        // takes care of calling _expose() for us.
        SCIA.Sidebar._expose();
    },

    submit : function(callingElement) {
        var SELF = this,
            new_pwd = $("#sidebar-new-password").val(),
            conf_new_pwd = $("#sidebar-new-password-conf").val(),
            id = SELF.id,
            token = SELF.token;

        if(SELF.submit_processing) {
            $("#sidebar-rstPwd-error").empty().html("We're still trying to take care of<br/>your last request!");
        }else {
            SELF.submit_processing = true;
        }

        if(new_pwd === "" ) {
            $("#sidebar-rstPwd-error").empty().html("Invalid password");
            return;
        }
        if(new_pwd != conf_new_pwd) {
            $("#sidebar-rstPwd-error").empty().html("The passwords don't match");
            return;
        }

        $.post("/d1/user/reset", {
            "id" : id,
            "token" : token,
            "new_pwd" : new_pwd
        }, function(response) {

            SELF.submit_processing = false;

            if(response.status === 0) {
                SELF._renderSuccess();
            }else {
                $("#sidebar-rstPwd-error").empty().html(response.short_message);
            }
        });
    }

};