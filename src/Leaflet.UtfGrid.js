var _ = require('underscore');
var L = require('leaflet');
var InteractionLayer = require('./Leaflet.InteractionLayer');

/**
 * The code of this class was mostly copied from the leaflet.utfgrid Leaflet
 * extension (MIT license, by David Leaver). The difference with the original
 * implementation is that 1) this class delegates tiles
 * loading/caching/canceling operations to an MapTilesLoader instance; 2) this
 * class notifies about loading of tiles for each new screen using the
 * "startLoading"/"endLoading" events; 3) it loads tiles starting from the
 * center of the current screen.
 */
var UtfGrid = InteractionLayer.extend({

    /** Initializes this layer */
    initialize : function(options) {
        var parent = InteractionLayer.prototype;
        parent.initialize.call(this, options);
        _.defaults(this.options, {
            resolution : 4,
            pointerCursor : true
        });
        this._loader = this.options.loader || //
        new MapTilesLoader(this.options);
    },
    /**
     * Returns an object from UTF grid corresponding to the coordinates of the
     * mouse event.
     */
    _objectForEvent : function(e) {
        var map = this._map;
        var zoom = map.getZoom();
        var point = map.project(e.latlng);
        var pos = this._getTilePosition(point);

        var tile = this._loader.getTile(zoom, pos);
        var result;
        if (tile) {
            result = this._getTileObject(tile, point);
        }

        return {
            latlng : e.latlng,
            data : result
        };
    },

    /**
     * Returns an object from the specified tile corresponding to the given
     * position.
     */
    _getTileObject : function(tile, point) {
        var gridX = this._getTileShift(point.x);
        var gridY = this._getTileShift(point.y);
        var idx = this._utfDecode(tile.grid[gridY].charCodeAt(gridX));
        var key = tile.keys[idx];
        var result = this._processData(tile.data[key]);
        return result;
    },

    /**
     * Returns a list of all objects contained in the specified UTFGrid tile.
     */
    getTileObjects : function(tile) {
        return tile && tile.data ? _.map(_.values(tile.data),
                this._processData, this) : [];
    },

    /**
     * Pre-process individual data object before returning it to the caller.
     */
    _processData : function(data) {
        if (!data)
            return data;
        if (!this._processDataF) {
            this._processDataF = this.options.processData || //
            function(data) {
                return data;
            };
        }
        return this._processDataF(data);
    },

    /**
     * Returns position of the specified coordinates in a tile
     */
    _getTileShift : function(val) {
        var tileSize = this.options.tileSize;
        var resolution = this.options.resolution;
        return Math.floor((val - (Math.floor(val / tileSize) * tileSize)) / //
        resolution);
    },

    /**
     * Decodes the specified character and transforms it in an index
     */
    _utfDecode : function(ch) {
        if (ch >= 93) {
            ch--;
        }
        if (ch >= 35) {
            ch--;
        }
        return ch - 32;
    }

});

module.exports = UtfGrid;
