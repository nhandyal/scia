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
    },

    register : {

        submit_processing : false,

        display : function() {
            this._render();
            SCIA.Sidebar._expose();
        },

        _render : function() {
            var SELF = this,
                html = "",
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
            var SELF = this,
                html = "",
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

            if(SELF.submit_processing) {
                $("#sidebar-register-error").empty().html("We're still trying to take care of<br/>your last request!");
            }else {
                SELF.submit_processing = true;
            }

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

            // everything looks good, let's submit to the server
            $.post("/d1/user/create", {
                "f_name" : fname,
                "l_name" : lname,
                "email" : email,
                "pwd" : pwd,
                "cb" : "https://www.uscscia.com"
            }, function(response) {
                
                SELF.submit_processing = false;

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

    },

    login : {

        submit_processing : false,

        display : function() {
            this._render();
            SCIA.Sidebar._expose();
        },

        _render : function() {
            var SELF = this,
                html = "",
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
            var SELF = this,
                email = $("#sidebar-loginEmail").val(),
                password = $("#sidebar-loginPassword").val();

            if(SELF.submit_processing) {
                $("#sidebar-login-error").empty().html("We're still trying to take care of<br/>your last request!");
            }else {
                SELF.submit_processing = true;
            }

            $.post("/d1/user/login", {
                "email" : email,
                "pwd" : password
            }, function(response) {

                SELF.submit_processing = false;

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
                    $("#sidebar-login-error").empty().html("This account hasn't been verified<br/><a class='sidebar-ui-link' href='javascript:SC.Sidebar.forgot_password.display()'>Resend verification email?</a>");
                }

            });
        }

    },

    forgot_password : {
        
        submit_processing : false,

        display : function() {
            this._render();
            SCIA.Sidebar._expose();
        },

        _render : function() {
            var SELF = this,
                html = "",
                $sidebar_wrapper = SCIA.Sidebar._renderBase();

            html += "<div>";
                html += "<div id='sidebar-fgPwd-error' class='sidebar-error'></div>";
                html += "<div class='sidebar-input-wrapper'>";
                    html += "<label class='sidebar-label' for='LoginEmail'>Registered Email</label>";
                    html += "<input id='sidebar-fgPwd-email' class='sidebar-input' type='email' name='LoginEmail' tabindex='1' />";
                html += "</div>";
                html += "<div class='sidebar-button large-button' onclick='SCIA.Sidebar.forgot_password.submit(this)'>Send Email</div>";
            html += "</div>";

            $sidebar_wrapper.html(html);
        },

        _renderSuccess : function() {
            var SELF = this,
                html = "",
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
                email = $("#sidebar-fgPwd-email").val(),
                cb = "https://www.uscscia.com",
                recoverLink = "/d1/user/recover?email="+email+"&cb=" + cb;

            if(SELF.submit_processing) {
                $("#sidebar-fgPwd-error").empty().html("We're still trying to take care of<br/>your last request!");
            }else {
                SELF.submit_processing = true;
            }

            $.get(recoverLink, function(response) {

                SELF.submit_processing = false;

                if(response.status === 0) {
                    SELF._renderSuccess();
                } else if(response.status == 10402) {
                    $("#sidebar-fgPwd-error").empty().html("This email isn't registered");
                }
            });
            
        }
    },

    _resend_verification_email : {

        email : "",

        display : function(email) {
            this.email = email;
            this._render();
            SCIA.Sidebar._expose();
        },

        _render : function() {

        }

    },

    reset_password : {
        
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

    }

};