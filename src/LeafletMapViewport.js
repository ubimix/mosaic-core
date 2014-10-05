define(
// Dependencies
[ 'require', 'leaflet' ],
// Module
function(require, L) {
    'use strict';

    /**
     * This class provides common utility methods to manage specific geographic
     * zone as the main viewport. It means that all operations like
     * fitBounds(bounds) or setView(latlng, zoom) will takes into account the
     * specified map zone and not the whole map.
     */
    var MapViewport = L.Class.extend({

        /**
         * Initializes this object.
         * 
         * @param options.map
         *            the Leaflet map object
         * @param options.viewport
         *            a L.Bounds instance defining the main visible zone on the
         *            map; see the #setViewport method
         * @param options.focus
         *            focus position on the map; when user uses #focusTo method
         *            then the specified lat/lng point is moved in the given
         *            position on the screen
         */
        initialize : function(options) {
            L.setOptions(this, options);
            var viewport = this.options.viewport;
            if (viewport) {
                this.setViewport(viewport);
            }
            if (this.options.focus) {
                this.setFocusPosition(this.options.focus);
            }
        },

        /**
         * Returns the map managed by this class. By default this method returns
         * the "options.map".
         */
        getMap : function() {
            return this.options.map;
        },

        /**
         * Defines the viewport for the map - the visible area of the map where
         * data should be focused and fitted. If a focus position is not defined
         * then this method sets the focus position to the center of the
         * specified viewport area.
         * 
         * @param viewport
         *            a L.Bounds instance defining the main visible zone on the
         *            map; this object defines top, right, left and bottom shift
         *            of the viewport on the visible map screen area
         * 
         */
        setViewport : function(viewport) {
            this._viewport = L.bounds(viewport);
            if (!this._focusPos) {
                this._focusPos = this._viewport.getCenter();
            }
        },

        /**
         * Returns the current viewport for the underlying map
         */
        getViewport : function() {
            if (this._viewport)
                return this._viewport;
            var map = this.getMap();
            return L.bounds([ 0, 0 ], map.getSize());
        },

        /**
         * Defines position on the map (in pixels) where map should be moved
         * when user tries to set view or focus on a specific geographic
         * position.
         * 
         * @param options.focus
         *            focus position on the map; when user uses #focusTo method
         *            then the specified lat/lng point is moved in the given
         *            position on the screen
         * 
         */
        setFocusPosition : function(pos) {
            this._focusPos = L.point(pos.left, pos.top);
        },

        /**
         * Moves the map to the specified geographic position. If a focus
         * position is specified the requested geographic position is moved in
         * this pixel position on the map screen area. Otherwise the focus
         * position defined by the "setFocusPosition" is used.
         */
        focusTo : function(coords, focusPos, callback) {
            var that = this;
            if (typeof focusPos === 'function') {
                callback = focusPos;
                focusPos = null;
            }
            callback = this._checkCallback(callback);
            var map = this.getMap();
            focusPos = focusPos || this._focusPos;
            map.once('moveend', callback);
            if (focusPos) {
                var focus = map._getTopLeftPoint();
                focus._add(focusPos);
                var shift = map.project(coords).subtract(focus);
                map.panBy(shift);
            } else {
                map.panTo(coords);
            }
        },

        /**
         * This method performs zoom (if necessary) and calls the specified
         * callback method. It is useful to be sure that the callback is really
         * invoked (which is not the case with the 'zoomend' Leaflet event).
         */
        zoomTo : function(zoom, callback) {
            var map = this.getMap();
            callback = this._checkCallback(callback);
            if (map.getZoom() == zoom) {
                callback();
            } else {
                map.once('zoomend', callback);
                map.setZoom(zoom);
            }
        },

        /**
         * Zooms and moves the map viewport to fit in the specified geographic
         * bounds.
         */
        panInsideBounds : function(bounds, callback) {
            var that = this;
            var map = that.getMap();
            callback = that._checkCallback(callback);
            var padding = that._getViewportPadding();
            var zoom = map.getBoundsZoom(bounds, true, padding);
            that.zoomTo(zoom, function() {
                var focusPos = that._focusPos;
                var newCenter = map._limitCenter(focusPos, zoom, bounds);
                if (!center.equals(newCenter)) {
                    that.focusTo(newCenter, callback);
                } else {
                    callback();
                }
            });
        },

        /**
         * This method fits the specified geographic bounds in the currently
         * defined viewport area.
         */
        fitBounds : function(bounds) {
            var viewport = this.getViewport();
            var padding = this._getViewportPadding();
            var options = {};
            options.paddingTopLeft = padding.min;
            options.paddingBottomRight = padding.max;
            var map = this.getMap();
            map.fitBounds(bounds, options);
        },

        /** Checks the specified function and returns a non-empty callback. */
        _checkCallback : function(callback) {
            return callback || function() {
            };
        },

        /**
         * An internal utility method returning the distance from the map bounds
         * and the viewport area.
         */
        _getViewportPadding : function() {
            var viewport = this.getViewport();
            var min = viewport.min;
            var map = this.getMap();
            var size = map.getSize();
            var max = size.subtract(viewport.max);
            return L.bounds(min, max);
        },

    });

    return MapViewport;
});
