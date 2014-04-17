SCIA.navigation = {

    init : function() {
        // initialize the navigation bar
        if(SCIA.utils.readCookie("id") !== null) {
            var name = SCIA.utils.readCookie("f_name") + " " + SCIA.utils.readCookie("l_name"),
                email = decodeURIComponent(SCIA.utils.readCookie("email"));

            $("#nav-personal > span").html(name);

            $("#nav-register").remove();
            $("#nav-login").remove();

            // let's do a bit more validation and remove the buy membership
            // field if the user isn't a USC student
            if(email.toLowerCase().indexOf("@usc.edu") == -1) {
                $("#nav-buy-membership").remove();
            }

            // if the user is already a member, let's remove the buy membership field
            if(SCIA.utils.readCookie("is_member")) {
                $("#nav-buy-membership").remove();
            }
        } else {
            $("#nav-personal").remove();
        }
        
        $("#navigation").animate({"opacity" : 1}, 100, function(){});

        // highlight the current view
        switch(window.location.pathname) {
            case "/about/":
                $("#nav-about").css("color" , "rgb(204,40,40)");
                break;
            case "/events/":
                $("#nav-events").css("color" , "rgb(204,40,40)");
                break;
        }
    }

};