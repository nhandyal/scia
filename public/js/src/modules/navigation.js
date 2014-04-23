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
            if(SCIA.utils.readCookie("is_member") == "true") {
                $("#nav-buy-membership").remove();
            }
        } else {
            $("#nav-personal").remove();
        }
        
        $("#navigation").animate({"opacity" : 1}, 0, function(){});

        // highlight the current view
        var pathname = window.location.pathname;
        console.log(pathname);
        if(pathname.indexOf('/about/') > -1) {
            $("#nav-about > a").css("color" , "rgb(204,40,40)");
        }else if(pathname.indexOf('/events/') > -1) {
            $("#nav-events > a").css("color" , "rgb(204,40,40)");
        }else {
            console.log("do nothing");
        }
    }

};