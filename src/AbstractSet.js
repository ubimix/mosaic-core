if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons' ],
// Module
function(require) {

    var Mosaic = require('mosaic-commons');
    var _ = require('underscore');

    /** Objects of this type are used to keep information about data set entries */
    var SetEntry = Mosaic.Class.extend(// 
    Mosaic.Events.prototype, Mosaic.Events, {
        initialize : function(options) {
            _.extend(this, options);
        }
    });

    /**
     * This is an abstract set used to manage of key/value pairs and generate
     * notifications about new/updated/removed entries in this set. To perform
     * notifications this class uses the "_onEnter", "_onUpdate" and "_onExit"
     * methods respectively. This class should be extended to add custom
     * behaviour for each type of changes.
     */
    var AbstractSet = Mosaic.Class.extend({

        /**
         * Class constructor.
         * 
         * 
         * @param options.getId
         *            this optional method is used to retrieve object
         *            identifiers
         */
        initialize : function(options) {
            Mosaic.Events.call(this);
            this.setOptions(options);
            if (_.isFunction(this.options.getKey)) {
                this.getKey = this.options.getKey;
            }
            this._index = {};
        },

        /**
         * Sets a new array of objects and calls onEnter, onUpdate and onExit
         * methods for each entry; each index contains keys and the
         * corresponding index entries with "key", "obj" and "idx" fields (where
         * "key" is the key of the object; "obj" the object itself and "idx" the
         * index of this object in the list). This method returns reference to
         * this instance to allow methods call chaining.
         */
        _setObjects : function(objects) {
            var that = this;
            var array = _.toArray(objects);
            var newIndex = {};
            var event = {
                enter : {},
                update : {},
                exit : {}
            };
            _.each(array, function(d, i) {
                var key = that.getKey(d);
                var entry;
                if (_.has(that._index, key)) {
                    entry = that._onUpdate(that._index[key]);
                    delete that._index[key];
                    event.update[entry.key] = entry;
                } else {
                    entry = that._onEnter(new SetEntry({
                        key : key,
                        obj : d,
                        idx : i
                    }));
                    event.enter[entry.key] = entry;
                }
                newIndex[key] = entry;
            });
            _.each(that._index, function(entry) {
                event.exit[entry.key] = that._onExit(entry);
            });
            that._index = newIndex;
            return event;
        },

        /**
         * This method returns index entries containing the data, the
         * corresponding key and position of the data object in the array.
         */
        _getIndexEntries : function(key) {
            if (key) {
                if (_.isArray(key)) {
                    return _.map(key, function(k) {
                        return this._index[k];
                    }, this);
                } else {
                    return this._index[key];
                }
            } else {
                return _.values(this._index);
            }
        },

        /**
         * This method returns an index entry corresponding to the specified
         * key.
         */
        _getIndexEntry : function(key) {
            return this._index[key];
        },

        /**
         * This method returns a key for the specified object. By default this
         * method returns the object itself. To change this behaviour this
         * method could be overloaded in subclasses or a "getKey" function can
         * be set in the constructor parameters.
         */
        getKey : function(d) {
            return d;
        },

        /**
         * This method returns a list of all object keys.
         */
        getKeys : function() {
            return _.keys(this._index);
        },

        /**
         * This method is called when a new object is added to the index.
         * 
         * @param entry
         *            an index entry object containing the index, its position
         *            and the corresponding key
         */
        _onEnter : function(entry) {
            entry.emit('enter');
            return entry;
        },

        /**
         * This method is called when an object is removed from the index.
         * 
         * @param entry
         *            an index entry object containing the index, its position
         *            and the corresponding key
         */
        _onExit : function(entry) {
            entry.emit('exit');
            return entry;
        },

        /**
         * This method is called to notify about updated (already existing in
         * index) objects.
         * 
         * @param entry
         *            an index entry object containing the index, its position
         *            and the corresponding key
         */
        _onUpdate : function(entry) {
            entry.emit('update');
            return entry;
        },

        /** Gets the index of an entry with the specified key. */
        getIndex : function(key) {
            var entry = key ? this._index[key] : null;
            return entry ? entry.idx : -1;
        },

        /**
         * Returns <code>true</code> if this set contains the specified key.
         */
        hasKey : function(key) {
            return _.has(this._index, key);
        }
    });
    AbstractSet.SetEntry = SetEntry;

    return AbstractSet;

});
