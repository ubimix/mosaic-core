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
     * Subclasses of this type are used to visualize data set content.
     */
    /**
     * This mixin contains common methods used to visualize data set content.
     */
    var DataSetView = Mosaic.Class.extend({

        /**
         * Constructor of this class. This method expects that the parameters
         * contain a "dataSet" field. These fields "onEnter", "onUpdate" and
         * "onExit" are used to provide/manage features on the map.
         * 
         * @param options.dataSet
         *            a mandatory data set object
         * @param options.onEnter
         *            an optional callback method providing new features for the
         *            map
         * @param options.onUpdate
         *            an optional callback method updating already existing
         *            features
         * @param options.onExit
         *            an optional callback executed just before features removal
         *            from the map
         * 
         */
        initialize : function(options) {
            var that = this;
            that.setOptions(options);
            options = that.getOptions();
            that._onEnter = options.onEnter;
            that._onExit = options.onExit;
            that._onUpdate = options.onUpdate;
        },

        /**
         * "Opens" this view and notify about all already existing nodes.
         */
        open : function() {
            var dataSet = this.getDataSet();
            this._onDataSetUpdate = _.bind(this._onDataSetUpdate, this);
            this._onDataSetUpdate({
                enter : dataSet.getData(),
                update : [],
                exit : [],
            });
            dataSet.on('update', this._onDataSetUpdate);
        },

        /**
         * Removes this view and unsubscribe from data set notifications.
         */
        close : function() {
            var dataSet = this.getDataSet();
            dataSet.on('update', this._onDataSetUpdate);
            this._onDataSetUpdate({
                enter : [],
                update : [],
                exit : dataSet.getData()
            });
        },

        /** Sets options (parameters) of this class. */
        setOptions : function(options) {
            this.options = _.extend(this.options || {}, options);
        },

        /**
         * Returns options (parameters) of this instance. The returned value is
         * used to retrieve the "dataSet" field as well as "onEnter", "onUpdate"
         * and "onExit" handlers. This method could be overloaded in subclasses
         * to re-define the source of these parameters.
         */
        getOptions : function() {
            return this.options || {};
        },

        /** Returns the underlying dataset */
        getDataSet : function() {
            var options = this.getOptions();
            return options.dataSet;
        },

        /**
         * Handles data set notifications and dispatch calls to registered
         * "onEnter", "onUpdate" and "onExit" handlers.
         */
        _onDataSetUpdate : function(e) {
            var that = this;
            var dataSet = that.getDataSet();
            _.each(e.exit, function(d) {
                var key = dataSet.getKey(d);
                var view = that._getView(key);
                if (!view)
                    return;
                if (that._onExit) {
                    that._onExit(d, view);
                }
                that._removeView(key, view);
            });
            function visit(data, callback) {
                if (!callback)
                    return;
                _.each(data, function(d) {
                    var key = dataSet.getKey(d);
                    var view = that._getView(key);
                    view = callback.call(that, d, view);
                    if (!view)
                        return;
                    that._setView(key, view);
                });
            }
            visit(e.enter, that._onEnter);
            visit(e.update, that._onUpdate);
        },

        /** Returns a view corresponding to the specified key. */
        _getView : function(key) {
            if (!this._index) {
                return null;
            }
            return this._index[key];
        },

        /** Sets a new view corresponding to the specified key. */
        _setView : function(key, view) {
            if (!this._index) {
                this._index = {};
            }
            this._index[key] = view;
            return this;
        },

        /** Sets a new view corresponding to the specified key. */
        _removeView : function(key, view) {
            if (this._index) {
                delete this._index[key];
            }
            return this;
        },

    });

    return DataSetView;

});
