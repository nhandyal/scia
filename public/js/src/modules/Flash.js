SCIA.Flash = function(flashMessage) {

    var SELF = this,
        windowDimensions = SCIA.utils.getWindowSize(),
        html = "<div id='scia-flash-message'>"+flashMessage+"</div>";

        $("body").append(html);
        var $flashMessage = $("#scia-flash-message");


        // we need to set the display : inline block prop to allow us to
        // get the actual element width
        $flashMessage.css({
            "display" : "inline-block"
        });

        
        var flashMessageWidth = $flashMessage.width(),
            positionLeft = (windowDimensions.width - flashMessageWidth) / 2;



        $flashMessage.css({
            "position" : "absolute",
            "top" : "35px",
            "left" : positionLeft,
            "padding-left" : "50px",
            "padding-right" : "50px",
            "text-align" : "center",
            "background" : "red",
            "line-height" : "25px",
            "font-size" : "14px"
        });

        setTimeout(function() {
            $flashMessage.remove();
        }, 5000);

};