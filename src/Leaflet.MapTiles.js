define([ 'underscore', 'leaflet', 'mosaic-commons' ], function(_, L, Mosaic) {

    /**
     * Common superclass for all map layers loading tiles using an external
     * loader object.
     */
    return Mosaic.Class.extend(Mosaic.Events.prototype, {

        /** Initializes this layer */
        initialize : function(options) {
            this.setOptions(options);
            _.defaults(this.options, {
                minZoom : 0,
                maxZoom : 25,
                tileSize : 256
            });
        },

        /**
         * This method is called when this layer is added to the map.
         */
        onAdd : function(map) {
            this._map = map;
            this._container = this._map._container;
            this._update();
        },

        /**
         * This method is called when this layer is removed from the map.
         */
        onRemove : function() {
        },

        /** Re-loads tiles for new map position */
        _update : function() {
            // Check if tiles should be loaded
            var zoom = this._map.getZoom();
            var tileSize = this.options.tileSize;
            if (zoom > this.options.maxZoom || //
            zoom < this.options.minZoom) {
                return;
            }

            // Load tiles
            var bounds = this._map.getPixelBounds();
            var min = this._getTilePosition(bounds.min);
            var max = this._getTilePosition(bounds.max);
            var queue = this._getTilesReferencesFromCenterOut(min, max);

            var evt = {
                queue : queue
            };
            var that = this;
            that.fire('startLoading', evt);
            return that._loadTiles(zoom, queue)//
            .then(function(tiles) {
                evt.tiles = tiles;
                that.fire('endLoading', evt);
            }, function(errors) {
                evt.errors = errors;
                that.fire('endLoading', evt);
            }).done();
        },

        /**
         * Loads and returns tiles corresponding to points specified in the
         * 'queue' parameter of this method.
         */
        _loadTiles : function(zoom, queue) {
            return Mosaic.P().then(function() {
                throw new Error('Not implemented');
            });
        },

        /** Calculates order of tiles loading */
        _getTilesReferencesFromCenterOut : function(min, max) {
            var queue = [];
            for (var j = min.y; j <= max.y; j++) {
                for (var i = min.x; i <= max.x; i++) {
                    queue.push(this._newPoint(i, j));
                }
            }
            if (queue.length) {
                var that = this;
                var center = this._newPoint((min.x + max.x) / 2,
                        (min.y + max.y) / 2);
                queue.sort(function(a, b) {
                    var delta = that._distance(a, center) - //
                    that._distance(b, center);
                    return delta;
                });
            }
            return queue;
        },

        /**
         * Creates and returns a new point object (containing X/Y coordinates).
         */
        _newPoint : function(x, y) {
            if (x.length) {
                y = x[1];
                x = x[0];
            }
            return {
                x : x,
                y : y,
                toString : function() {
                    return JSON.stringify(this, null, 2);
                }
            };
        },

        /**
         * Calculates distance between two points. This method is used to
         * calculate order of tiles loading.
         */
        _distance : function(a, b) {
            var x = a.x - b.x;
            var y = a.y - b.y;
            return Math.sqrt(x * x + y * y);
        },

        /**
         * Returns X/Y coordinates of the tile corresponding to the specified
         * point on the map
         */
        _getTilePosition : function(point) {
            var tileSize = this.options.tileSize;
            return this._newPoint(Math.floor(point.x / tileSize), Math
                    .floor(point.y / tileSize));
        },

    });

});
