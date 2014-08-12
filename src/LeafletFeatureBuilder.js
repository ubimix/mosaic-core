if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'mosaic-commons', 'leaflet' ],
// Module
function(require) {

    var L = require('leaflet');
    var Mosaic = require('mosaic-commons');

    var Config = Mosaic.Class.extend({

        initialize : function(data, options) {
            this.data = data;
            _.extend(this, options);
            var methods = [ 'onClick', 'onMouseOver', 'onMouseOut',
                    'onDblClick', 'onMouseMove' ];
            this._handlers = {};
            _.each(methods, function(m) {
                var key = m.toLowerCase().substring(2);
                this[m] = function(handler) {
                    if (handler !== undefined) {
                        this._handlers[key] = handler;
                        return this;
                    } else {
                        return this_handlers[key];
                    }
                };
            }, this);
        },

        setOptions : function(opt) {
            this.opt = opt;
            return this;
        },

        getOptions : function() {
            var args = _.toArray(arguments);
            return this._getOrInvoke(this.opt, args) || {};
        },

        setMarker : function(m) {
            this._marker = m;
            return this;
        },

        getMarker : function() {
            var args = _.toArray(arguments);
            return this._getOrInvoke(this._marker, args);
        },

        build : function() {
            var that = this;
            var data = that.data;
            var geom = data.geometry;
            if (that._isEmptyGeometry(geom)) {
                return false;
            }
            var options = that.getOptions(data);
            var layer = L.GeoJSON.geometryToLayer(data, function(resource,
                latlng) {
                var marker = that.getMarker(latlng, options);
                if (!marker) {
                    marker = new L.Marker(latlng, options);
                }
                return marker;
            }, L.GeoJSON.coordsToLatLng, options);
            _.each(that._handlers, function(handler, event) {
                layer.on(event, function(ev) {
                    handler(data, ev);
                });
            });
            return layer;
        },

        _getOrInvoke : function(val, args) {
            if (_.isFunction(val)) {
                return val.apply(val, args);
            } else {
                return val;
            }
        },

        /**
         * Returns <code>true</code> if the specified geometry is empty.
         */
        _isEmptyGeometry : function(geom) {
            if (!geom || !geom.coordinates || //
            !geom.coordinates.length)
                return true;
            if (geom.type == 'Point') {
                if (!geom.coordinates[0] || !geom.coordinates[1])
                    return true;
            }
            return false;
        },

    });

    var LeafletFeatureBuilder = function(data, options) {
        return new Config(data, options);
    };

    return LeafletFeatureBuilder;

});