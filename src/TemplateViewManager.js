if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'jquery', 'mosaic-commons', './AdapterManager',
        './TemplateView', './TemplateDataSetView' ],
// Module
function(require) {
    "use strict";

    var _ = require('underscore');
    var $ = require('jquery');
    var Mosaic = require('mosaic-commons');
    var Class = Mosaic.Class;
    var AdapterManager = require('./AdapterManager');
    var TemplateView = require('./TemplateView');
    var TemplateDataSetView = require('./TemplateDataSetView');

    /**
     * Instances of this type manage visual widgets for resources shown in
     * various contexts. The same resource could be shown differently in
     * different contexts. For example a person profile in a contact list has
     * much details than the same user profile shown on a separate page. So
     * resource visualization depends on the <em>context</em> and on the
     * <em>type</em> of each resource. This class manages adapters for all
     * resource types for their respective contexts.
     */
    var TemplateViewManager = Class.extend({

        initialize : function() {
            this._adapterManager = new AdapterManager();
        },

        /**
         * Registers visualization widget for all resources of the specified
         * type shown in the contexts with the given contextKey.
         */
        registerView : function(contextKey, resourceType, View) {
            this._adapterManager
                    .registerAdapter(contextKey, resourceType, view);
        },

        /** Creates and returns a new view for the specified resource type. */
        newView : function(contextKey, resourceType, options) {
            return this._adapterManager.newAdapterInstance(contextKey,
                    resourceType, options);
        },

        /**
         * Analyzes the given HTML block and extracts from it all widget
         * definitions.
         */
        buildViews : function(html) {
            var that = this;
            html = $(html);
            // This method recursively iterates over all parent elements
            // and add all methods defined in these elements.
            function extendViewType(ViewType, el, set) {
                var id = el.attr('id') || _.uniqueId('template-');
                el.attr('id', id);
                // Check that the element id was not visited yet (to
                // avoid infinite reference loops).
                set = set || {};
                if (id in set)
                    return ViewType;
                set[id] = true;
                var extendedType = el.attr('data-extends');
                if (extendedType) {
                    var parentViewEl = html.find(extendedType);
                    ViewType = extendViewType(ViewType, parentViewEl, set);
                }
                return ViewType.extendViewType(el, ViewType);
            }
            html.find('[data-view]').each(
                    function() {
                        var el = $(this);
                        var contextKey = el.attr('data-view-context');
                        var resourceType = el.attr('data-view') || 'Default';
                        var ViewType = that._getBasicViewType(contextKey,
                                resourceType);
                        ViewType = extendViewType(ViewType.extend({}), el);
                        that.registerView(contextKey, resourceType, ViewType);
                    });
        },

        /** Returns the basic view type depending on the context. */
        _getBasicViewType : function(contextKey, resourceType) {
            contextKey = (contextKey || '').toLowerCase();
            if (contextType === 'layout') {
                return TemplateDataSetView;
            }
            return TemplateView;
        },

    });

    return TemplateViewManager;

});
