if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', './AbstractSet' ],
// Module
function(require) {

    var Mosaic = require('mosaic-commons');
    var _ = require('underscore');
    var AbstractSet = require('./AbstractSet');

    /**
     * Subclasses of this type are used to visualize data set content.
     */
    /**
     * This mixin contains common methods used to visualize data set content.
     */
    var DataSetView = AbstractSet.extend(//
    Mosaic.Events, Mosaic.Events.prototype, {

        /**
         * Constructor of this class. This method expects that the parameters
         * contain a "dataSet" field. These fields "onEnter", "onUpdate" and
         * "onExit" are used to provide/manage features on the map.
         * 
         * @param options.dataSet
         *            a mandatory data set object
         */
        initialize : function(options) {
            Mosaic.Events.apply(this, arguments);
            AbstractSet.prototype.initialize.apply(this, arguments);
            this._onDataSetUpdate = _.bind(this._onDataSetUpdate, this);
            if (!this.options.dataSet) {
                throw new Error('Data set is not defined.');
            }
        },

        /**
         * Returns a key for the specified object. This method uses the "getKey"
         * method of the underlying data set.
         */
        getKey : function(d) {
            return this.getDataSet().getKey(d);
        },

        /**
         * "Opens" this view and notify about all already existing nodes.
         */
        open : function() {
            if (this._open)
                return false;
            var dataSet = this.getDataSet();
            dataSet.on('update:end', this._onDataSetUpdate);
            this._setData(dataSet.getData());
            this._open = true;
            return true;
        },

        /**
         * Removes this view and unsubscribe from data set notifications.
         */
        close : function() {
            if (!this._open)
                return false;
            var dataSet = this.getDataSet();
            dataSet.off('update:end', this._onDataSetUpdate);
            this._setData([]);
            this._open = false;
            return true;
        },

        /** Returns the underlying dataset */
        getDataSet : function() {
            return this.options.dataSet;
        },

        /**
         * Creates a new view and attaches it to the specified index entry. This
         * method should be overloaded in subclasses.
         */
        createView : function(entry) {
            if (this.options.createView) {
                this.options.createView.call(this, entry);
            }
        },

        /**
         * Destroys a view in the specified index entry. This method should be
         * overloaded in subclasses.
         */
        destroyView : function(entry) {
            if (this.options.destroyView) {
                this.options.destroyView.call(this, entry);
            }
        },

        /**
         * Updates a view in the specified index entry. This method should be
         * overloaded in subclasses.
         */
        updateView : function(entry) {
            if (this.options.updateView) {
                this.options.updateView.call(this, entry);
            }
        },

        /** Handles added data objects. */
        _onEnter : function(entry) {
            this.createView(entry);
            entry.fire('enter');
            this.triggerMethod('view:add', entry);
            return entry;
        },

        /** Handles data updates - changes the view visualization. */
        _onUpdate : function(entry) {
            this.updateView(entry);
            entry.fire('update');
            this.triggerMethod('view:update', entry);
            return entry;
        },

        /** Handles data removal - destroys the corresponding view */
        _onExit : function(entry) {
            entry.fire('exit');
            this.destroyView(entry);
            this.triggerMethod('view:destroy', entry);
            return entry;
        },

        /** Rebuild views corresponding to the specified data entries. */
        _setData : function(data) {
            var that = this;
            that.triggerMethod('update:begin');
            that._setObjects(data);
            that.triggerMethod('update:end');
            return this;
        },

        /**
         * Handles data set update notifications and render individual views.
         */
        _onDataSetUpdate : function(e) {
            var dataSet = this.getDataSet();
            var data = dataSet.getData();
            this._setData(data);
        },

    });

    return DataSetView;

});
