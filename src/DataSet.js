if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', './AbstractSet', 'mosaic-commons' ],
// Module
function(require) {

    var Mosaic = require('mosaic-commons');
    var AbstractSet = require('./AbstractSet');
    var _ = require('underscore');

    /**
     * This class represents a data set. Each dataset manages a set of objects
     * with unique keys. The "setData" of this class accepts an array of objects
     * and sends notifications about changes with this data set to the
     * registered listener. This listener could be registered using the
     * "setListener" method or it can be defined as a parameter of the class
     * constructor.
     */
    var DataSet = AbstractSet.extend(Mosaic.Events.prototype, Mosaic.Events, {

        /**
         * Class constructor.
         * 
         * 
         * @param options.getId
         *            this optional method is used to retrieve object
         *            identifiers
         */
        initialize : function(options) {
            AbstractSet.prototype.initialize.apply(this, arguments);
            Mosaic.Events.call(this);
            this._open = false;
        },

        /**
         * Opens this data set - registeres data set listeners and sets the
         * initial data.
         */
        open : function() {
            if (this._open)
                return false;
            this.triggerMethod('open');
            if (this.options.data) {
                this.setData(this.options.data);
            }
            this._open = true;
            return true;
        },

        /** Closes this dataset. It removes all registered listeners. */
        close : function() {
            if (!this._open)
                return false;
            this.setData([]);
            this.triggerMethod('close');
            this._open = false;
            return true;
        },

        /**
         * Sets a new array of objects and generates an "update" event
         * containing the "enter", "exit" and "update" indexes; each index
         * contains keys and the corresponding index entries with "key", "obj"
         * and "idx" fields (where "key" is the key of the object; "obj" the
         * object itself and "idx" the index of this object in the list). This
         * method returns reference to this instance to allow methods call
         * chaining.
         */
        setData : function(data) {
            this.triggerMethod('update:begin');
            var event = this._setObjects(data);
            this.triggerMethod('update', event);
            this.triggerMethod('update:end');
            return this;
        },

        /**
         * This method returns an object with the specified key or the full
         * array of all objects if such a key is not defined.
         */
        getData : function(key) {
            if (key) {
                var entry = this._index[key];
                return entry ? entry.obj : null;
            } else {
                return _.map(this._index, function(entry) {
                    return entry.obj;
                });
            }
        },

        /**
         * This method returns an index entries containing the data, the
         * corresponding key and position of the data object in the array.
         */
        getDataEntries : function(key) {
            if (key) {
                var entry = this._index[key];
                return entry;
            } else {
                return _.values(this._index);
            }
        },

        /** Returns position of the specified entity in this dataset. */
        getDataIndex : function(d) {
            var key = this.getKey(d);
            return this.getIndex(key);
        },

    });

    return DataSet;

});
