SCIA.parallax = {

    parallaxTiles: null,
    busy: false,
    rate: 0.5,

    init: function (rate, parallaxClass) {
        var SELF = this,
            parallaxElements = document.getElementsByClassName(parallaxClass);

        this.rate = (rate <= 1 && rate > 0) ? rate : 0.5;
        this.parallaxTiles = [parallaxElements.length];

        for (var i = 0; i < parallaxElements.length; i++) {
            this.parallaxTiles[i] = this.ParallaxTile(parallaxElements[i]);
        }

        // Register scroll listeners
        $(window).scroll(function (e) {
            SELF.requestFrameUpdate();
        });
    },

    requestFrameUpdate: function () {
        var SELF = this;
        if (!this.busy) {
            requestAnimationFrame(function () {
                SELF.updateParallax();
            });
            this.busy = true;
        }
    },

    updateParallax: function () {
        for (var i = 0; i < this.parallaxTiles.length; i++) {
            this.parallaxTiles[i].render();
        }
        this.busy = false;
    },


    /*
     * ParallaxTile factory
     */
    ParallaxTile: function (parallaxDOMElement) {
        var internals = function (parallax) {

            this.parallaxDOMElement = parallaxDOMElement;
            this.offset = new parallax.Offset(this.parallaxDOMElement);

            var transformAnchorY = Math.floor(parallax.rate * window.innerHeight);

            this.render = function () {
                this.offset.update();

                // This is where the parallax magic happens
                if (this.offset.visible) {
                    var relativeTransformY = transformAnchorY + (parallax.rate * this.offset.edgeTopOffset);

                    $(this.parallaxDOMElement).css("background-position-y", relativeTransformY);
                }
            };

        },

            _temp = new internals(this);

        // initialize the element to its correct initial position
        _temp.render();

        return _temp;
    },

    /*
     * For a detailed description of what these values represent check out docs/parallax/elementOffsets
     * To see if an element is in view edgeTopOffset < 0 && edgeBottomOffset > 0
     */
    Offset: function (DOMElement) {
        if (DOMElement === null)
            return null;

        var elementHeight = $(DOMElement).height(),
            absoluteEdgeTop = $(DOMElement).offset().top,
            absoluteEdgeBottom = absoluteEdgeTop + elementHeight;

        this.scrollOffset = 0;
        this.edgeTopOffset = 0;
        this.edgeBottomOffset = 0;
        this.visible = false;

        this.update = function () {
            var scrollPosition = $(window).scrollTop();

            this.scrollOffset = absoluteEdgeTop - scrollPosition;
            this.edgeTopOffset = absoluteEdgeTop - (scrollPosition + window.innerHeight);
            this.edgeBottomOffset = absoluteEdgeBottom - scrollPosition;
            this.visible = this.edgeTopOffset < 0 && this.edgeBottomOffset > 0;
        };

        return this;
    }
};