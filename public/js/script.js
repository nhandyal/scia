window.onload = function() {

    function $(el) {
        return document.querySelector(el);
    }

    var slider = $('#slider'),
        sliderContent = $('#slider-content'),
        slides = sliderContent.getElementsByTagName('section'),
        slideCount = slides.length,
        slideWidth = (100 / slideCount) + "00%",
        control, n = 0, move;

    function init() {
        sliderContent.style.width = slideCount + "00%";

        for(var i = 0; i < slideCount; i++) {
            slides[i].style.width = slideWidth;
        }
    }

    control = {

        margin: function(n) {
            sliderContent.style.marginLeft = '-'+n+'00%';
        },

        prev: function() {
            (n === 0) ? n = (slideCount - 1) : n--;
            control.margin(n);
        },

        next: function() {
            (n < slideCount - 1) ? n++ : n = 0;
            control.margin(n);
        },

        slide: function() {
            move = setInterval(function(){
                (n < slideCount - 1) ? n++ : n = 0;
                control.margin(n);
            }, 4000)
        }
    }

    


    control.slide();
    init();
}