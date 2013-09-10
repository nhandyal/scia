// Initialize all the included modules


// Expose the SCIA and SC object to the window
if (typeof window === "object") {
    window.SCIA = window.SC = SCIA;
}
    
})(window);
