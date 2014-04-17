SCIA.Sidebar.resend_verification_email = {

    _submit : function(email) {
        var SELF = this;

        if(!SCIA.Sidebar._beginTransaction()) {
            return;
        }

        $.post("/d1/user/resendVerificationEmail", {
            "email" : email,
            "cb" : window.location.origin + window.location.pathname
        }, function(response) {

            SCIA.Sidebar._endTransaction();

            if(response.status === 0) {
                SELF._render("Awesome, you're almost there!<br/>Check your email for further instructions");
                return;
            }else {
                SELF._render(response.short_message);
                return;
            }

        });


    },

    _render : function(message) {
        var html = "",
            $sidebar_wrapper = SCIA.Sidebar._renderBase();

        html += "<div class='sidebar-error'>"+message+"</div>";

        $sidebar_wrapper.html(html);

        // we call expose to center the element
        // this doesn't need to be done on _render() because display (higher up the chain)
        // takes care of calling _expose() for us.
        SCIA.Sidebar._expose();
    }

};