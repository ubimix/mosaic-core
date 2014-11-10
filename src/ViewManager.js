var _ = require('underscore');
var Mosaic = require('mosaic-commons');
var AdapterManager = require('./AdapterManager');

/**
 * Instances of this type manage visual widgets for resources shown in various
 * contexts. For example a person profile in a contact list has much less
 * details than the same user profile shown on a separate page. So resource
 * visualization depends on the <em>context</em> and on the <em>type</em> of
 * each resource. This class manages adapters for resource types in their
 * respective contexts.
 */
var ViewManager = Mosaic.Class.extend({

    initialize : function(options) {
        this.setOptions(options);
        this._adapterManager = this.options.adapterManager || // 
        new AdapterManager();
        if (this.options.getResourceType) {
            this.getResourceType = this.options.getResourceType;
        }
    },

    /**
     * Registers visualization widget for all resources of the specified type
     * shown in the contexts with the given viewType.
     */
    registerView : function(viewType, resourceType, View) {
        this._adapterManager.registerAdapter(viewType, resourceType, View);
    },

    /** Creates and returns a new view for the specified resource type. */
    newView : function(viewType, resourceType, options) {
        return this._adapterManager.newAdapterInstance(viewType, resourceType,
                options);
    },

    /**
     * Returns the type of the specified object. This method should be
     * overloaded in subclasses or in the constructor parameters.
     */
    getResourceType : function(d) {
        return d.type || '';
    },

});

module.exports = ViewManager;
