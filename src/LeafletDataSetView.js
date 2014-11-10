var L = require('leaflet');
var DataSetView = require('./DataSetView');

/**
 * A Leaflet layer providing automatic rendering of data from a dataset. This
 * class uses the "onEnter", "onUpdate" and "onExit" callbacks to generate
 * visible features on the map. Use the "LeafletFeatureBuilder" class to
 * simplify creation of leaflet features in these callbacks.
 */
var LeafletDataSetView = DataSetView.extend({

    initialize : function(options) {
        DataSetView.prototype.initialize.apply(this, arguments);
        // this._onZoomEnd = _.debounce(_.bind(this._onZoomEnd, this), 200);
        this._onZoomEnd = _.bind(this._onZoomEnd, this);
    },

    /**
     * This method is used by Leaflet when this layer is inserted in the map.
     */
    onAdd : function(map) {
        this._map = map;
        this._map.on('zoomend', this._onZoomEnd);
        this._layer = new L.featureGroup();
        this._map.addLayer(this._layer);
        this.open();
        this._onZoomEnd();
    },

    /**
     * This method is called by Leaflet to remove this layer from the map.
     */
    onRemove : function(map) {
        this.close();
        this._map.removeLayer(this._layer);
        this._map.off('zoomend', this._onZoomEnd);
        delete this._map;
        delete this._layer;
    },

    /**
     * Creates a new view and attaches it to the specified index entry.
     */
    _onEnter : function(entry) {
        entry.layer = this._newLeafletLayer(entry);
        if (entry.layer) {
            this._layer.addLayer(entry.layer);
        }
        entry.emit('enter');
        return entry;
    },

    /**
     * Destroys a view in the specified index entry. This method should be
     * overloaded in subclasses.
     */
    _onExit : function(entry) {
        if (entry.layer) {
            this._layer.removeLayer(entry.layer);
        }
        entry.emit('exit');
        return entry;
    },

    /**
     * Creates and returns a new leaflet layer for the specified entry. This
     * method should be overloaded in subclasses to create real map entities.
     */
    _newLeafletLayer : function(entry) {
    },

    /** This method is called when the map changes its zoom level. */
    _onZoomEnd : function() {
        var that = this;
        var zoom = that._map.getZoom();
        _.each(that._index, function(entry) {
            entry.emit('zoomend', {
                entry : entry,
                zoom : zoom
            });
        });
    }

});

module.exports = LeafletDataSetView;
