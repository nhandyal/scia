SCIA.Sidebar.resend_verification_email = {

    email : "",

    display : function(email) {
        this.email = email;
        this._render();
        SCIA.Sidebar._expose();
    },

    _render : function() {

    }

};