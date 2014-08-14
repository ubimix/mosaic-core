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
    var DataSetView = Mosaic.Class.extend(// 
    Mosaic.Events, Mosaic.Events.prototype, {

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
            Mosaic.Events.apply(this);
            that.setOptions(options);
            options = that.getOptions();
            _.each([ 'onEnter', 'onExit', 'onUpdate' ], function(name) {
                if (options[name]) {
                    that['_' + name] = options[name];
                }
            });
        },

        /**
         * "Opens" this view and notify about all already existing nodes.
         */
        open : function() {
            if (this._opened)
                return;
            this.triggerMethod('open');
            var dataSet = this.getDataSet();
            this._onDataSetUpdate = _.bind(this._onDataSetUpdate, this);
            this._onDataSetUpdate({
                enter : dataSet.getData(),
                update : [],
                exit : [],
            });
            dataSet.on('update', this._onDataSetUpdate);
            this._opened = true;
        },

        /**
         * Removes this view and unsubscribe from data set notifications.
         */
        close : function() {
            if (!this._opened)
                return;
            var dataSet = this.getDataSet();
            dataSet.off('update', this._onDataSetUpdate);
            this._onDataSetUpdate({
                enter : [],
                update : [],
                exit : dataSet.getData()
            });
            this.triggerMethod('close');
            this._opened = false;
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
            that.triggerMethod('update:begin');
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
                    var idx = dataSet.getIndex(key);
                    that._setView(key, view, idx);
                });
            }
            visit(e.enter, that._onEnter);
            visit(e.update, that._onUpdate);
            that.triggerMethod('update:end');
        },

        /** Returns all view in the order defined by the data set. */
        _getViews : function() {
            var that = this;
            var dataSet = that.getDataSet();
            var views = _.map(dataSet.getData(), function(d, i) {
                var key = dataSet.getKey(d);
                var view = that._getView(key);
                return view;
            });
            return views;
        },

        /** Returns a view corresponding to the specified key. */
        _getView : function(key) {
            if (!this._index) {
                return null;
            }
            return this._index[key];
        },

        /** Sets a new view corresponding to the specified key. */
        _setView : function(key, view, idx) {
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
