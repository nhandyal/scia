SCIA.Sidebar.login = {

    display : function() {
        this._render();
        SCIA.Sidebar._expose();
    },

    _render : function() {
        var html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase();

        html += "<div>";
            html += "<div id='sidebar-login-error' class='sidebar-error'></div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label' for='LoginEmail'>Email</label>";
                html += "<input id='sidebar-loginEmail' class='sidebar-input' type='email' name='LoginEmail' value='' tabindex='1' />";
            html += "</div>";
            html += "<div class='sidebar-input-wrapper'>";
                html += "<label class='sidebar-label' for='LoginPassword'>Password</label>";
                html += "<input id='sidebar-loginPassword' class='sidebar-input' type='password' name='LoginPassword' value='' tabindex='2' />";
            html += "</div>";
            html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.login.submit(this)'>login</div>";
            html += "<a class='sidebar-ui-link' href='javascript:SC.Sidebar.forgot_password.display()'>Forgot Password?</a>";
        html += "</div>";

        $sidebar_wrapper.html(html);

    },

    submit : function(callingElement) {
        var email = $("#sidebar-loginEmail").val(),
            password = $("#sidebar-loginPassword").val();

        if(!SCIA.Sidebar._beginTransaction()) {
            return;
        }

        $.post("/d1/user/login", {
            "email" : email,
            "pwd" : password
        }, function(response) {

            SCIA.Sidebar._endTransaction();

            if(response.status === 0) {
                // all good, close the login box and refresh the page
                SCIA.Sidebar._hide(function() {
                    window.location = "/";
                });
            } else if(response.status == 10402) {
                $("#sidebar-login-error").empty().html("This email isn't registered");
            } else if(response.status == 10050) {
                $("#sidebar-login-error").empty().html("Invalid password");
            } else if (response.status == 10051) {
                $("#sidebar-login-error").empty().html("This account hasn't been verified<br/><a class='sidebar-ui-link' href=\"javascript:SC.Sidebar.resend_verification_email._submit(\'"+email+"\')\">Resend verification email?</a>");
            }

        });
    }

};