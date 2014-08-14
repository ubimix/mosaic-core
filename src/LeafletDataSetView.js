if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'leaflet', './DataSetView' ],
// Module
function(require) {

    var L = require('leaflet');
    var DataSetView = require('./DataSetView');

    /**
     * A Leaflet layer providing automatic rendering of data from a dataset.
     * This class uses the "onEnter", "onUpdate" and "onExit" callbacks to
     * generate visible features on the map. Use the "LeafletFeatureBuilder"
     * class to simplify creation of leaflet features in these callbacks.
     */
    var LeafletDataSetView = DataSetView.extend({

        /**
         * Creates a new view and attaches it to the specified index entry.
         */
        createView : function(entry) {
            DataSetView.prototype.createView.apply(this, arguments);
            if (entry.layer) {
                this._layer.addLayer(entry.layer);
            }
        },

        /**
         * Destroys a view in the specified index entry. This method should be
         * overloaded in subclasses.
         */
        destroyView : function(entry) {
            if (entry.layer) {
                this._layer.removeLayer(entry.layer);
            }
            DataSetView.prototype.destroyView.apply(this, arguments);
        },

        /**
         * This method is used by Leaflet when this layer is inserted in the
         * map.
         */
        onAdd : function(map) {
            this._map = map;
            this._layer = new L.featureGroup();
            this._map.addLayer(this._layer);
            this.open();
        },

        /**
         * This method is called by Leaflet to remove this layer from the map.
         */
        onRemove : function(map) {
            this.close();
            this._map.removeLayer(this._layer);
            delete this._map;
            delete this._layer;
        },

    });

    return LeafletDataSetView;

});