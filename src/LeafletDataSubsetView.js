if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', './DataSubsetView' ],
// Module
function(require) {

    var DataSubsetView = require('./DataSubsetView');

    /**
     * This class manages entries of sub-sets of a data set. It does not
     * add/remove features on the map, it just changes their representation.
     */
    var LeafletDataSubsetView = DataSubsetView.extend({

        /**
         * This method is used by Leaflet when this layer is inserted in the
         * map.
         */
        onAdd : function(map) {
            this._map = map;
            this.open();
        },

        /** This method is called by Leaflet to remove this layer from the map. */
        onRemove : function(map) {
            this.close();
            delete this._map;
        },

    });

    return LeafletDataSubsetView;

});