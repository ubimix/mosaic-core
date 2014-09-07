define(
// Dependencies
[ 'underscore', 'leaflet', 'mosaic-commons', 'rbush',
        './Leaflet.InteractionLayer', './IndexedCanvas' ],
// Module
function(_, L, Mosaic, Rbush, InteractionLayer, IndexedCanvas) {

    /** This mixin provides methods used to index data points. */
    var MarkersLayer = InteractionLayer.extend({

        /**
         */
        initialize : function(options) {
            options = _.extend({
                async : true
            }, options);
            options.fillOpacity = options.opacity;
            delete options.opacity;
            InteractionLayer.prototype.initialize.call(this, options);
            this._canvasLayer = new L.TileLayer.Canvas(this.options);
            this._canvasLayer._redrawTile = _.bind(this._redrawTile, this);
            this._objectForEvent = _.bind(this._objectForEvent, this);
            this._clearTile = _.bind(this._onTileUnload, this);
            this._canvasLayer.on('tileunload', this._onTileUnload);
            this.setData(this.options.data);
        },

        // --------------------------------------------------------------------
        // Leaflet.InteractionLayer method

        /**
         * Returns an object from UTF grid corresponding to the coordinates of
         * the mouse event.
         */
        _objectForEvent : function(e) {
            var latlng = e.latlng;
            var map = this._map;
            var point = map.latLngToLayerPoint(latlng);
            point = point.add(map.getPixelOrigin());
            var tileSize = this._getTileSize();
            var tilePoint = point.divideBy(tileSize).floor();
            var key = tilePoint.x + ':' + tilePoint.y;
            var canvas = this._canvasLayer._tiles[key];
            var data;
            if (canvas && canvas._index) {
                var id = canvas._index._id;
                var canvasX = point.x % tileSize;
                var canvasY = point.y % tileSize;
                data = canvas._index.getData(canvasX, canvasY);
            }
            return {
                latlng : latlng,
                data : data
            };
        },

        // --------------------------------------------------------------------
        // Leaflet.ILayer methods

        /**
         * This method is called when this layer is added to the map.
         */
        onAdd : function(map) {
            InteractionLayer.prototype.onAdd.call(this, map);
            map.addLayer(this._canvasLayer);
        },

        /**
         * This method is called when this layer is removed from the map.
         */
        onRemove : function(map) {
            map.removeLayer(this._canvasLayer);
            InteractionLayer.prototype.onRemove.call(this, map);
        },

        // --------------------------------------------------------------------

        setData : function(data) {
            this._indexData(data);
            this._canvasLayer.redraw();
        },
        // --------------------------------------------------------------------

        /** Indexes the specified data array using a quad tree. */
        _indexData : function(data) {
            // Data indexing
            this._index = Rbush(9);
            data = data || [];
            var data = _.map(data, function(d) {
                var coordinates = this._getBoundingBoxArray(d);
                if (coordinates) {
                    coordinates.data = d;
                }
                return coordinates;
            }, this);
            data = _.filter(data, function(array) {
                return !!array;
            });
            this._index.load(data);
        },

        /** Searches resources inside of the specified bounding box. */
        _searchInBbox : function(bbox, point) {
            var sw = bbox.getSouthWest();
            var ne = bbox.getNorthEast();
            point = point || ne;
            var coords = [ sw.lat, sw.lng, ne.lat, ne.lng ];
            var p = [ point.lat, point.lng ];
            var array = this._index.search(coords);
            // Sort points by Manhattan distance to the origin point
            array.sort(function(a, b) {
                var d1 = Math.abs(a[0] - p[0]) + Math.abs(a[1] - p[1]);
                var d2 = Math.abs(b[0] - p[0]) + Math.abs(b[1] - p[1]);
                return d1 - d2;
            });
            var result = _.map(array, function(arr) {
                return arr.data;
            });
            return result;
        },

        /** Returns size of canvas tiles. */
        _getTileSize : function() {
            return this._canvasLayer._getTileSize();
        },

        /** Returns a buffer zone size around each tile. */
        _getBufferZoneSize : function() {
            var r = this._getRadius() * 2.5;
            return L.point(r, r);
        },

        /**
         * This method is called when a tile is removed from the map. It cleans
         * up data associated with this tile.
         */
        _onTileUnload : function(evt) {
            var canvas = evt.tile;
            if (canvas._index) {
                canvas._index.reset();
                delete canvas._index;
            }
        },

        /**
         * This method is used by the underlying L.TileLayer.Canvas to draw
         * information on the canvas tile.
         */
        _redrawTile : function(canvas) {
            var that = this;
            var tileSize = that._getTileSize();
            var tilePoint = canvas._tilePoint;
            var nwPoint = tilePoint.multiplyBy(tileSize);
            var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
            var bufferSize = that._getBufferZoneSize();
            nwPoint = nwPoint.subtract(bufferSize);
            sePoint = sePoint.add(bufferSize);
            var bbox = new L.LatLngBounds(that._map.unproject(sePoint),
                    that._map.unproject(nwPoint));
            var index = that._getCanvasIndex(canvas);
            var data = that._searchInBbox(bbox);
            _.each(data, function(d) {
                var ctx = that._drawFeature(tilePoint, bbox, d);
                if (ctx) {
                    index.draw(ctx.image, ctx.anchor.x, ctx.anchor.y, d);
                }
            });
            that._canvasLayer.tileDrawn(canvas);
        },

        // -----------------------------------------------------------------

        /**
         * Returns an IndexedCanvas instance associated with the specified
         * canvas.
         */
        _getCanvasIndex : function(canvas) {
            var that = this;
            var index = canvas._index;
            if (index) {
                index.reset();
            } else {
                that._maskIndex = that._maskIndex || {};
                index = canvas._index = new IndexedCanvas({
                    canvas : canvas,
                    maskIndex : that._maskIndex
                });
            }
            return index;
        },

        /**
         * Returns an array with a bounding box ([south, west, north, east]) for
         * the specified object.
         */
        _getBoundingBoxArray : function(d) {
            if (!d.geometry || !d.geometry.coordinates)
                return null;
            var coords = d.geometry.coordinates;
            var array = [ coords[1], coords[0], coords[1], coords[0] ];
            return array;
        },

        /**
         * Draws the specified resource and returns an image with x/y
         * coordinates of this image on the canvas.
         * 
         * @return an object containing the following fields: a) 'image' - an
         *         Image or Canvas instance with the drawn result b) 'anchor' a
         *         L.Point instance defining the point on the returned image
         *         corresponding to resource coordinates
         */
        _drawFeature : function(tilePoint, bbox, resource) {
            var geom = resource.geometry;
            if (!geom)
                return;
            var coords = geom.coordinates;
            if (!coords)
                return;
            var latlng = new L.LatLng(coords[1], coords[0]);
            var p = this._map.project(latlng);
            var tileSize = this._getTileSize();
            var s = tilePoint.multiplyBy(tileSize);

            var x = Math.round(p.x - s.x);
            var y = Math.round(p.y - s.y);
            var icon = this._getIconInfo(resource);
            var anchor = L.point(x, y);
            if (icon.anchor) {
                anchor._subtract(icon.anchor);
            }
            return {
                image : icon.image,
                anchor : anchor
            }
        },

        /**
         * Loads and returns icon information corresponding to the specified
         * resource.
         */
        _getIconInfo : function(resource) {
            var type = this._getResourceType(resource);
            var map = this._map;
            var zoom = map.getZoom();
            var iconIndex = this._iconIndex = this._iconIndex || {};
            var indexKey = zoom + ':' + type;
            var icon = iconIndex[indexKey];
            if (!icon) {
                icon = this._drawIcon(type);
                iconIndex[indexKey] = icon;
            }
            return icon;
        },

        /** Returns the type (as a string) of the specified resource. */
        _getResourceType : function(resource) {
            return 'resource';
        },

        _getOptionValue : function(key) {
            var val = this.options[key];
            if (_.isFunction(val)) {
                var args = _.toArray(arguments);
                args.splice(0, 1);
                val = val.apply(this.options, args);
            }
            return val;
        },

        _getVal : function(key, defaultValue) {
            return this._getOptionValue(key, this._map.getZoom())
                    || defaultValue;
        },

        _getRadius : function(defaultValue) {
            return this._getVal('radius', 16);
        },

        /**
         * Draws an icon and returns information about it as an object with the
         * following fields: a) 'image' - an Image or a Canvas instance b)
         * 'anchor' a L.Point instance defining the position on the icon
         * corresponding to the resource coordinates
         */
        _drawIcon : function(type) {
            var radius = this._getRadius();
            var canvas = document.createElement('canvas');
            var lineWidth = this._getVal('lineWidth', 1);
            var width = radius * 2;
            var height = radius * 2;
            canvas.height = height;
            canvas.width = width;
            radius -= lineWidth;
            var g = canvas.getContext('2d');
            g.fillStyle = this._getVal('fillColor', 'white');
            g.globalAlpha = this._getVal('fillOpacity', 1);
            g.strokeStyle = this._getVal('lineColor', 'gray');
            g.lineWidth = lineWidth;
            g.lineCap = 'round';
            this._drawMarker(g, lineWidth, lineWidth, width - lineWidth * 2,
                    height - lineWidth * 2, radius * 0.6);
            g.fill();
            g.stroke();
            return {
                image : canvas,
                anchor : L.point(width / 2, height)
            };
        },

        _drawMarker : function(g, x, y, width, height, radius) {
            g.beginPath();
            // a
            g.moveTo(x + width / 2, y);
            // b
            g.bezierCurveTo(//
            x + width / 2 + radius / 2, y, //
            x + width / 2 + radius, y + radius / 2, //
            x + width / 2 + radius, y + radius);
            // c
            g.bezierCurveTo( //
            x + width / 2 + radius, y + radius * 2, //
            x + width / 2, y + height / 2 + radius, //
            x + width / 2, y + height);
            // d
            g.bezierCurveTo(//
            x + width / 2, y + height / 2 + radius, //
            x + width / 2 - radius, y + radius * 2, //
            x + width / 2 - radius, y + radius);
            // e (a)
            g.bezierCurveTo(//
            x + width / 2 - radius, y + radius / 2, //
            x + width / 2 - radius / 2, y + 0, //
            x + width / 2, y + 0);
            g.closePath();
        },

    });

    return MarkersLayer;

});
