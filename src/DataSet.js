if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'mosaic-commons', 'underscore' ],
// Module
function(require) {

    var Mosaic = require('mosaic-commons');
    var _ = require('underscore');

    /**
     * This class represents a data set. Each dataset manages a set of objects
     * with unique keys. The "setData" of this class accepts an array of objects
     * and sends notifications about changes with this data set to the
     * registered listener. This listener could be registered using the
     * "setListener" method or it can be defined as a parameter of the class
     * constructor.
     */
    var DataSet = Mosaic.Class.extend(Mosaic.Events.prototype, {

        /**
         * Class constructor.
         * 
         * 
         * @param options.getId
         *            this optional method is used to retrieve object
         *            identifiers
         * @param options.listener
         *            the listener to set
         */
        initialize : function(options) {
            Mosaic.Events.call(this);
            this.setOptions(options);
            if (_.isFunction(this.options.getKey)) {
                this.getKey = this.options.getKey;
            }
            this._index = {};
            this._data = [];
        },

        /**
         * Opens this data set - registeres data set listeners and sets the
         * initial data.
         */
        open : function() {
            if (this.options.data) {
                this.setData(this.options.data);
            }
        },

        /** Closes this dataset. It removes all registered listeners. */
        close : function() {
        },

        /**
         * Sets a new array of objects and generates an "update" event
         * containing the "enter", "exit" and "update" arrays. This method
         * returns reference to this instance.
         */
        setData : function(data) {
            var array = _.toArray(data);
            var newIndex = {};
            var newData = [];
            var event = {
                enter : [],
                update : [],
                exit : []
            };
            _.each(array, function(d, i) {
                var key = this.getKey(d);
                if (_.has(this._index, key)) {
                    event.update.push(d);
                    delete this._index[key];
                } else {
                    event.enter.push(d);
                }
                newIndex[key] = {
                    d : d,
                    i : i
                };
                newData.push(d);
            }, this);
            _.each(this._index, function(s) {
                event.exit.push(s.d);
            }, this);
            this._index = newIndex;
            this._data = newData;
            this.emit('update', event);
            return this;
        },

        /**
         * This method returns an object with the specified key or the full
         * array of all objects if such a key is not defined.
         */
        getData : function(key) {
            if (key) {
                var slot = this._index[key];
                return slot ? slot.d : null;
            } else {
                return this._data;
            }
        },

        /** Returns position of the specified entity in this dataset. */
        getDataIndex : function(d) {
            var key = this.getKey(d);
            return this.getIndex(key);
        },

        /** Gets the index of an entry with the specified key. */
        getIndex : function(key) {
            var slot = key ? this._index[key] : null;
            return slot ? slot.i : -1;
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

    });

    return DataSet;

});
