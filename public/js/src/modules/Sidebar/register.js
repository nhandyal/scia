SCIA.Sidebar.register = {

    display : function() {
        this._render();
        SCIA.Sidebar._expose();
    },

    _render : function() {
        var html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase();

        html += "<div>";
            html += "<div id='sidebar-register-error' class='sidebar-error'></div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>First Name</label>";
                html += "<input id='sidebar-register-fname' class='sidebar-input' type='text' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Last Name</label>";
                html += "<input id='sidebar-register-lname' class='sidebar-input' type='text' tabindex='2' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Email <span class='sidebar-label-smaller'>(@usc.edu required for membership)</span></label>";
                html += "<input id='sidebar-register-email' class='sidebar-input' type='email' tabindex='3' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Password</label>";
                html += "<input id='sidebar-register-password' class='sidebar-input' type='password' tabindex='4' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label'>Confirm Password</label>";
                html += "<input id='sidebar-register-password-conf' class='sidebar-input' type='password' tabindex='5' />";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.register.submit(this)'>Register</div>";
        html += "</div>";

        $sidebar_wrapper.html(html);
    },

    _renderSuccess : function() {
        var html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase();

        html += "<div class='sidebar-error'>Awesome, you're almost there!<br/>Check your email for further instructions</div>";

        $sidebar_wrapper.html(html);

        // we call expose to center the element
        // this doesn't need to be done on _render() because display (higher up the chain)
        // takes care of calling _expose() for us.
        SCIA.Sidebar._expose();
    },

    submit : function(callingElement) {
        var SELF = this,
            fname = $("#sidebar-register-fname").val(),
            lname = $("#sidebar-register-lname").val(),
            email = $("#sidebar-register-email").val(),
            pwd = $("#sidebar-register-password").val(),
            pwd_conf = $("#sidebar-register-password-conf").val();

        // ensure all fields have been submitted
        if(fname === "" || lname === "" || email === "" || pwd === "" || pwd_conf === "") {
            $("#sidebar-register-error").empty().html("All fields are required");
            return;
        }

        // validate email
        if(email.indexOf("@") == -1) {
            $("#sidebar-register-error").empty().html("Invalid email");
            return;
        }

        // make sure passwords match
        if(pwd != pwd_conf) {
            $("#sidebar-register-error").empty().html("passwords don't match");
            return;
        }

        if(!SCIA.Sidebar._beginTransaction()) {
            return;
        }

        // everything looks good, let's submit to the server
        $.post("/d1/user/create", {
            "f_name" : fname,
            "l_name" : lname,
            "email" : email,
            "pwd" : pwd,
            "cb" : window.location.origin + window.location.pathname
        }, function(response) {
            
            SCIA.Sidebar._endTransaction();

            if(response.status === 0) {
                SELF._renderSuccess();
                return;
            }else if(response.status == 10001) {
                $("#sidebar-register-error").empty().html("This email is already registered.<br/><a class='sidebar-ui-link' href='javascript:SC.Sidebar.forgot_password.display()'>Forgot Password?</a>");
                return;
            }else if(response.status == 10501) {
                $("#sidebar-register-error").empty().html("UhOh, we messed something up.<br/>Try again later.");
                return;
            }else {
                $("#sidebar-register-error").empty().html(response.short_message);
                return;
            }

        });
    }

};