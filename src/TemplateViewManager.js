
    "use strict";

    var _ = require('underscore');
    var ViewManager = require('./ViewManager');
    var $ = require('jquery');
    var TemplateView = require('./TemplateView');
    var TemplateDataSetView = require('./TemplateDataSetView');

    /**
     * This extension of the ViewManager class provides additional methods used
     * to build templates from HTML DOM by extending existing classes.
     */
    var TemplateViewManager = ViewManager.extend({

        /**
         * Analyzes the given HTML block and extracts from it all widget
         * definitions.
         */
        buildViews : function(html) {
            var that = this;
            html = $(html);
            // This method recursively iterates over all parent elements
            // and add all methods defined in these elements.
            function extendViewType(el, ViewType, set) {
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
                    ViewType = extendViewType(parentViewEl, ViewType, set);
                }
                return ViewType.extendViewType(el, ViewType);
            }
            html.find('[data-view-type]').each(function() {
                var el = $(this);
                var viewType = el.attr('data-view-type') || '';
                var resourceType = el.attr('data-resource-type') || '';
                var ViewType = that._getBasicViewType(viewType, resourceType);
                ViewType = ViewType.extend();
                ViewType = extendViewType(el, ViewType);
                that.registerView(viewType, resourceType, ViewType);
            });
        },

        /** Returns the basic view type depending on the context. */
        _getBasicViewType : function(viewType, resourceType) {
            viewType = (viewType || '').toLowerCase();
            if (resourceType === 'DataSet') {
                return TemplateDataSetView;
            }
            return TemplateView;
        },

    });

    module.exports = TemplateViewManager;

