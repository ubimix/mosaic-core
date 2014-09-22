define([ 'leaflet', 'rbush', './IndexedCanvas' ], function(L, Rbush,
    IndexedCanvas) {

    /**
     * This layer draws data on canvas tiles.
     */
    var MarkersLayer = L.TileLayer.Canvas.extend({

        /** Default options of this class. */
        options : {
            // Default size of a minimal clickable zone is 4x4 screen pixels.
            resolution : 4,
            // Show pointer cursor for zones associated with data
            pointerCursor : true,
            // Asynchronous tiles drawing
            async : true,
            // Don't reuse canvas tiles
            reuseTiles : false
        },

        /**
         * Initializes this layer
         */
        initialize : function(options) {
            // Not used anymore. Deprecated. To remove.
            this._canvasLayer = this;
            options.fillOpacity = options.opacity;
            delete options.opacity;
            var url = null;
            L.TileLayer.Canvas.prototype.initialize.apply(this, url, options);
            L.setOptions(this, options);
            this.setData(this.options.data);
        },

        // --------------------------------------------------------------------
        // Leaflet.ILayer/L.TileLayer.Canvas methods

        /**
         * This method is called when this layer is added to the map.
         */
        onAdd : function(map) {
            L.TileLayer.Canvas.prototype.onAdd.apply(this, arguments);
            this.on('tileunload', this._onTileUnload, this);
            map.on('click', this._click, this);
            map.on('mouseover mouseout mousemove', this._move, this);
        },

        /**
         * This method is called when this layer is removed from the map.
         */
        onRemove : function(map) {
            this.off('tileunload', this._onTileUnload, this);
            map.off('click', this._click, this);
            map.off('mouseover mouseout mousemove', this._move, this);
            this._removeMouseCursorStyle();
            L.TileLayer.Canvas.prototype.onRemove.apply(this, arguments);
        },

        /**
         * Initializes container for tiles.
         */
        _initContainer : function() {
            var initContainer = L.TileLayer.Canvas.prototype._initContainer;
            initContainer.apply(this, arguments);
            var pane = this._map._panes.markerPane;
            pane.appendChild(this._container);
        },

        // --------------------------------------------------------------------
        // Event management

        /** Map click handler */
        _click : function(e) {
            if (!this.hasEventListeners('click'))
                return;
            var on = this._objectForEvent(e);
            if (on.data) {
                this.fire('click', on);
            }
        },

        /** Map move handler */
        _move : function(e) {
            // if (!this.hasEventListeners('mouseout')
            // && !this.hasEventListeners('mouseover')
            // && !this.hasEventListeners('mousemove'))
            // return;
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

        // --------------------------------------------------------------------
        // Cursor style management

        /**
         * Checks if the cursor style of the container should be changed to
         * pointer cursor
         */
        _setMouseCursorStyle : function() {
            if (!this.options.pointerCursor)
                return;
            var container = this._getMapContainer();
            if (!container._pointerCursorCount) {
                container._pointerCursorCount = 1;
                container.style.cursor = 'pointer';
            } else {
                container._pointerCursorCount++;
            }
        },

        /** Removes cursor style from the map container */
        _removeMouseCursorStyle : function() {
            if (!this.options.pointerCursor)
                return;
            var container = this._getMapContainer();
            if (container._pointerCursorCount) {
                container._pointerCursorCount--;
                if (container._pointerCursorCount === 0) {
                    container.style.cursor = '';
                    delete container._pointerCursorCount;
                }
            }
        },

        /** Returns a map container. */
        _getMapContainer : function() {
            return this._map._container;
        },

        // --------------------------------------------------------------------
        // Data management

        /** Sets the specified data and re-draws the layer. */
        setData : function(data) {
            this._indexData(data);
            this.redraw();
        },

        /** Indexes the specified data array using a quad tree. */
        _indexData : function(data) {
            // Data indexing
            this._rtree = new Rbush(9);
            data = data || [];
            var array = [];
            L.Util.invokeEach(data, function(i, d) {
                var bbox = this._getBoundingBox(d);
                if (bbox) {
                    var coords = this._toIndexKey(bbox);
                    coords.data = d;
                    array.push(coords);
                }
            }, this);
            this._rtree.load(array);
        },

        /** Searches resources in the specified bounding box. */
        _searchInBbox : function(bbox, point) {
            var coords = this._toIndexKey(bbox);
            var p = point ? [ point.lat, point.lng ] : //
            [ coords[0], coords[1] ];
            var array = this._rtree.search(coords);
            // Sort points by Manhattan distance to the origin point
            array.sort(function(a, b) {
                var d1 = Math.abs(a[0] - p[0]) + Math.abs(a[1] - p[1]);
                var d2 = Math.abs(b[0] - p[0]) + Math.abs(b[1] - p[1]);
                return d1 - d2;
            });
            var result = [];
            L.Util.invokeEach(array, function(i, arr) {
                result.push(arr.data);
            });
            return result;
        },

        /**
         * This method transforms a L.LatLngBounds instance into a key for RTree
         * index.
         */
        _toIndexKey : function(bbox) {
            var sw = bbox.getSouthWest();
            var ne = bbox.getNorthEast();
            var coords = [ sw.lat, sw.lng, ne.lat, ne.lng ];
            return coords;
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
         * This method is used to draw on canvas tiles. It is invoked by the
         * parent L.TileLayer.Canvas class.
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
            var index = that._getCanvasIndex(canvas, true);
            var data = that._searchInBbox(bbox);
            L.Util.invokeEach(data, function(i, d) {
                var ctx = that._drawFeature(tilePoint, bbox, d);
                if (ctx) {
                    index.draw(ctx.image, ctx.anchor.x, ctx.anchor.y, d);
                }
            });
            that.tileDrawn(canvas);
        },

        /**
         * Returns an object from the internal index corresponding to the
         * coordinates of the mouse event.
         */
        _objectForEvent : function(e) {
            var latlng = e.latlng;
            var map = this._map;
            var point = map.latLngToLayerPoint(latlng);
            point = point.add(map.getPixelOrigin());
            var tileSize = this._getTileSize();
            var tilePoint = point.divideBy(tileSize).floor();
            var key = tilePoint.x + ':' + tilePoint.y;
            var canvas = this._tiles[key];

            var data;
            if (canvas) {
                var index = this._getCanvasIndex(canvas, false);
                if (index) {
                    var canvasX = point.x % tileSize;
                    var canvasY = point.y % tileSize;
                    data = index.getData(canvasX, canvasY);
                }
            }
            return {
                latlng : latlng,
                data : data
            };
        },

        /**
         * Returns an IndexedCanvas instance associated with the specified
         * canvas.
         */
        _getCanvasIndex : function(canvas, create) {
            if (!canvas._index && create) {
                var maskIndex = this._maskIndex = this._maskIndex || {};
                canvas._index = new IndexedCanvas({
                    canvas : canvas,
                    maskIndex : maskIndex
                });
            }
            return canvas._index;
        },

        // -----------------------------------------------------------------
        // The following methods could be overloaded to adapt this layer to
        // other data structures and drawing styles.

        /**
         * Returns a L.LatLngBounds instance defining a bounding box ([south,
         * west, north, east]) for the specified object.
         */
        _getBoundingBox : function(d) {
            var coords = this._getCoordinates(d);
            if (!coords)
                return;
            var bbox = L.latLngBounds(L.latLng(coords[1], coords[0]), L.latLng(
                    coords[1], coords[0]));
            return bbox;
        },

        /**
         * Draws the specified resource and returns an image with x/y position
         * of this image on the tile. If this method returns nothing (or a
         * <code>null</code> value) then nothing is drawn for the specified
         * resource.
         * 
         * @return an object containing the following fields: a) 'image' - an
         *         Image or Canvas instance with the drawn result b) 'anchor' a
         *         L.Point object defining position on the returned image on the
         *         tile;
         */
        _drawFeature : function(tilePoint, bbox, resource) {
            var coords = this._getCoordinates(resource);
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
            };
        },

        // -----------------------------------------------------------------
        // All other methods are specific for resources corresponding to points
        // on maps and used only by the _getBoundingBox and/or by _drawFeature
        // methods.

        /**
         * Returns point coordinates for the specified resource.
         */
        _getCoordinates : function(d) {
            var geom = d.geometry;
            if (!geom || !geom.coordinates)
                return null;
            var coords;
            if (geom.type == 'Point') {
                coords = geom.coordinates;
            } else {
                var layer = L.GeoJSON.geometryToLayer(geom);
                var bbox = layer.getBounds();
                var center = bbox.getCenter();
                coords = [ center.lng, center.lat ];
            }
            return coords;
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

        /** Returns an option value */
        _getOptionValue : function(key) {
            var val = this.options[key];
            if (typeof val === 'function') {
                var args = _.toArray(arguments);
                args.splice(0, 1);
                val = val.apply(this.options, args);
            }
            return val;
        },

        /** Returns an option value */
        _getVal : function(key, defaultValue) {
            return this._getOptionValue(key, this._map.getZoom()) || //
            defaultValue;
        },

        /** Get the radius of markers. */
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

        /** Draws a simple marker */
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
