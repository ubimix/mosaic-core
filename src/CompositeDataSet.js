if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', './DataSet' ],
// Module
function(require) {

    var _ = require('underscore');
    var DataSet = require('./DataSet');

    /**
     * This class is used to merge multiple datasets in one based on common data
     * keys.
     */
    var CompositeDataSet = DataSet.extend({

        /**
         * Constructor of this class.
         * 
         * @param options.getKey
         *            an function returning the key in the merged results
         * @param options.dataSets
         *            a list of data sets used as a source of data objects
         * @param options.merge
         *            a function accepting an array of data entries from all
         *            data sets corresponding to the same key
         */
        initialize : function(options) {
            DataSet.prototype.initialize.apply(this, arguments);
            this._filterDataSets = _.bind(this._filterDataSets, this);
            this.setFilter(this.options.filterData || this.options.filter);
            this.open();
        },

        /**
         * Opens this data set - registeres data set listeners and launches the
         * initial data merge.
         */
        open : function() {
            _.each(this.options.dataSets, function(dataSet) {
                dataSet.on('update', this._filterDataSets);
            }, this);
            this._filterDataSets();
        },

        /** Closes this dataset. It removes all registered listeners. */
        close : function() {
            _.each(this.options.dataSets, function(dataSet) {
                dataSet.off('update', this._filterDataSets);
            }, this);
            DataSet.prototype.setData.call(this, []);
        },

        /** Sets a new filter and updates this data set. */
        setFilter : function(filter) {
            this._filter = filter;
            this._filterDataSets();
            return this;
        },

        /**
         * This method all data sets. It calls the "_filterData" method for all
         * objects corresponding to the same key from all datasets.
         */
        _filterDataSets : function() {
            var keys = {};
            var dataSets = this.options.dataSets;
            _.each(dataSets, function(dataSet) {
                _.each(dataSet.getKeys(), function(key) {
                    keys[key] = true;
                });
            }, this);
            var data = [];
            _.each(_.keys(keys), function(key) {
                var array = _.map(dataSets, function(dataSet) {
                    var d = dataSet.getData(key);
                    return d;
                });
                var d = this._filterData(key, array);
                if (d) {
                    data.push(d);
                }
            }, this);
            DataSet.prototype.setData.call(this, data);
        },

        /**
         * Filters/merges individual objects corresponding to the same key.
         * 
         * @param array
         *            an array of objects from all datasets corresponding to the
         *            same key
         * @param key
         *            the key of the data
         */
        _filterData : function(key, array) {
            if (this._filter) {
                return this._filter(key, array);
            }
            var args = [ {} ].concat(array);
            return _.extend.call(null, args);
        },

        /**
         * Overloads the parent "setData" method and rises an exception. This
         * class should not accept direct data changes. It builds its data using
         * parent data sets.
         */
        setData : function() {
            throw new Error('This method ' + //
            'should not be called directly. ' + //
            'This dataset is a combination of parent datasets.');
        }
    });

    /** This datasets choses for each key the first non-empty value. */
    CompositeDataSet.OR = CompositeDataSet.extend({
        /**
         * This method returns the first non-empty value from the list of values
         * corresponding to the specified key.
         * 
         * @param array
         *            an array of objects from all datasets corresponding to the
         *            same key
         * @param key
         *            the key of the data
         */
        _filterData : function(key, array) {
            var result = _.find(array, function(val) {
                return !!val;
            });
            return result;
        },
    });

    /** This datasets selects only values existing all datasets. */
    CompositeDataSet.AND = CompositeDataSet.extend({
        /**
         * This method returns the first non-empty value from the list of values
         * corresponding to the specified key.
         * 
         * @param array
         *            an array of objects from all datasets corresponding to the
         *            same key
         * @param key
         *            the key of the data
         */
        _filterData : function(key, array) {
            var result = null;
            return !_.find(array, function(val) {
                result = val;
                return !val;
            }) ? result : null;
        },
    });

    return CompositeDataSet;

});
