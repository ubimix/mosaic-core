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
         * Sets a new view corresponding to the specified key.
         */
        _setView : function(key, view) {
            var oldView = this._getView(key);
            DataSetView.prototype._setView.apply(this, arguments);
            if (oldView) {
                this._layer.removeLayer(oldView);
            }
            this._layer.addLayer(view);
            return this;
        },

        /** Sets a new view corresponding to the specified key. */
        _removeView : function(key, view) {
            DataSetView.prototype._removeView.apply(this, arguments);
            this._layer.removeLayer(view);
            return this;
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