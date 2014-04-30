SCIA.Sidebar.forgot_password = {

    display : function() {
        this._render();
        SCIA.Sidebar._expose();
    },

    _render : function() {
        var html = "",
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
            email = $("#sidebar-fgPwd-email").val(),
            cb = window.location.origin + window.location.pathname,
            recoverLink = "/d1/user/recover?email="+email+"&cb=" + cb;

        if(!SCIA.Sidebar._beginTransaction()) {
            return;
        }

        $.get(recoverLink, function(response) {

            SCIA.Sidebar._endTransaction();

            if(response.status === 0) {
                SELF._renderSuccess();
            } else if(response.status == 10402) {
                $("#sidebar-fgPwd-error").empty().html("This email isn't registered");
            }
        });
        
    }
};