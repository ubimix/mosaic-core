

    var DataSetView = require('./DataSetView');

    /**
     * This class manages entries of sub-sets of a data set. It does not
     * add/remove features on the map, it just changes their representation.
     */
    var LeafletDataSubsetView = DataSetView.extend({

        /**
         * Creates a new view and attaches it to the specified index entry.
         */
        _onEnter : function(entry) {
            var parentView = this.options.parent;
            if (parentView) {
                var parentEntry = parentView._getIndexEntry(entry.key);
                // Copies all fields from a view found in the parent
                _.extend(entry, parentEntry);
            }
            entry.emit('enter');
            return entry;
        },

        /**
         * This method is used by Leaflet when this layer is inserted in the
         * map.
         */
        onAdd : function(map) {
            this.open();
        },

        /** This method is called by Leaflet to remove this layer from the map. */
        onRemove : function(map) {
            this.close();
        }

    });

    module.exports = LeafletDataSubsetView;

