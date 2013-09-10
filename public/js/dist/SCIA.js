/*!
 * SCIA site controller
 */
(function(window) {

    // Create the SCIA Object and set SC to be an allias of SCIA
    var SCIA = {},
        SC = SCIA;

    // Create global SCIA vars
    SCIA.head = document.getElementsByTagName("head")[0];
    // Initialize all the included modules


    // Expose the SCIA and SC object to the window
    if (typeof window === "object") {
        window.SCIA = window.SC = SCIA;
    }

})(window);
