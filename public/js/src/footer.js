// Initialize all the included modules
SC.ZuneView.init({height:4},"ZuneView");

// Expose the SCIA and SC object to the window
if (typeof window === "object") {
    window.SCIA = window.SC = SCIA;
}
    
})(window);
