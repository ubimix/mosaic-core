define(
// Dependencies
[ 'underscore', 'leaflet', 'mosaic-commons', './Leaflet.MapTiles' ],
// Module
function(_, L, Mosaic, MapTiles) {

    /**
     * The code of this class was mostly copied from the leaflet.utfgrid Leaflet
     * extension (MIT license, by David Leaver). The difference with the
     * original implementation is that 1) this class delegates tiles
     * loading/caching/canceling operations to an Mosaic.MapTilesLoader
     * instance; 2) this class notifies about loading of tiles for each new
     * screen using the "startLoading"/"endLoading" events; 3) it loads tiles
     * starting from the center of the current screen.
     */
    var InteractionLayer = MapTiles.extend({

        /** Initializes this layer */
        initialize : function(options) {
            var parent = MapTiles.prototype;
            parent.initialize.call(this, options);
            _.defaults(this.options, {
                resolution : 4,
                pointerCursor : true
            });
            this._move = _.throttle(this._move, 20);
            this._update = _.debounce(this._update, 10);
        },

        /**
         * This method is called when this layer is added to the map.
         */
        onAdd : function(map) {
            this._map = map;
            this._container = this._map._container;
            this._update();
            map.on('click', this._click, this);
            map.on('mousemove', this._move, this);
            map.on('moveend', this._update, this);
        },

        /**
         * This method is called when this layer is removed from the map.
         */
        onRemove : function() {
            var map = this._map;
            map.off('click', this._click, this);
            map.off('mousemove', this._move, this);
            map.off('moveend', this._update, this);
            this._removeMouseCursorStyle();
        },

        /** Map click handler */
        _click : function(e) {
            var on = this._objectForEvent(e);
            if (on.data) {
                this.fire('click', on);
            }
        },

        /** Map move handler */
        _move : function(e) {
            var on = this._objectForEvent(e);
            if (on.data !== this._mouseOn) {
                if (this._mouseOn) {
                    this.fire('mouseout', {
                        latlng : e.latlng,
                        data : this._mouseOn
                    });
                    this._removeMouseCursorStyle();
                }
                if (on.data) {
                    this.fire('mouseover', on);
                    this._setMouseCursorStyle();
                }
                this._mouseOn = on.data;
            } else if (on.data) {
                this.fire('mousemove', on);
            }
        },

        /**
         * Checks if the cursor style of the container should be changed to
         * pointer cursor
         */
        _setMouseCursorStyle : function() {
            if (!this.options.pointerCursor)
                return;
            if (!this._container._pointerCursorCount) {
                this._container._pointerCursorCount = 1;
                this._container.style.cursor = 'pointer';
            } else {
                this._container._pointerCursorCount++;
            }
        },

        /** Removes cursor style from the container */
        _removeMouseCursorStyle : function() {
            if (!this.options.pointerCursor)
                return;
            if (this._container._pointerCursorCount) {
                this._container._pointerCursorCount--;
                if (this._container._pointerCursorCount === 0) {
                    this._container.style.cursor = '';
                    delete this._container._pointerCursorCount;
                }
            }
        },

        /**
         * Returns an object from UTF grid corresponding to the coordinates of
         * the mouse event.
         */
        _objectForEvent : function(e) {
            throw new Error('This method should be implemented '
                    + 'in subclasses.');
        },

    });

    return InteractionLayer;

});
