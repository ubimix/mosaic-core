if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', //
'./DataSetView', './TemplateView' ],

// Module
function(require) {
    var _ = require('underscore');
    var Mosaic = require('mosaic-commons');
    var DataSetView = require('./DataSetView');
    var TemplateView = require('./TemplateView');

    /**
     * This view automatically listens modifications in a data set specified as
     * a constructor parameter and builds views for each entry in this data set.
     * To append all
     */
    var TemplateDataSetView = TemplateView.extend(DataSetView.prototype, {

        /** Constructor of this class. */
        initialize : function(options) {
            DataSetView.prototype.initialize.apply(this, arguments);
            TemplateView.prototype.initialize.apply(this, arguments);
            if (!this.options.viewManager) {
                throw new Error('View manager is not defined');
            }
            if (this.options.getType) {
                this.getType = this.options.getType;
            }
        },

        /**
         * Returns the type of the specified object. This method should be
         * overloaded in subclasses or in the constructor parameters.
         */
        getType : function(d) {
            return d.type || 'Default';
        },

        /** This method is called when the rendering processes starts. */
        onRenderEnd : function() {
            this.open();
        },

        /** This method is called when this view is removed from the parent. */
        onRemove : function() {
            this.close();
        },

        /** Renders all child views and appends them to the specified element. */
        renderChildren : function(elm, options) {
            this._container = elm;
            this.childOptions = options || {};
        },

        /**
         * Creates a new view and attaches it to the specified index entry. This
         * method should be overloaded in subclasses.
         */
        createView : function(entry) {
            var viewManager = this.options.viewManager;
            var viewType = this._getContainerViewType();
            var resourceType = this.getType(entry.obj);
            var options = _.extend({}, this.childOptions, {
                viewManager : viewManager,
                obj : entry.obj,
                parent : this
            });
            entry.view = viewManager.newView(viewType, resourceType, options);
            if (entry.view) {
                entry.view.render();
                var container = this._getContainerElement();
                this._container.append(entry.view.$el);
                entry.view.triggerMethod('create');
            }
        },

        /**
         * Destroys a view in the specified index entry. This method should be
         * overloaded in subclasses.
         */
        destroyView : function(entry) {
            if (!entry.view)
                return;
            entry.view.remove();
            entry.view.triggerMethod('destroy');
            delete entry.view;
        },

        /**
         * console.log('TemplateDataSetView: ',
         * _.functions(TemplateDataSetView.prototype));
         * 
         * Updates a view in the specified index entry. This method should be
         * overloaded in subclasses.
         */
        updateView : function(entry) {
            if (!entry.view)
                return;
            entry.view.triggerMethod('update');
        },

        /** Sets a new container element where child views should be appended. */
        _setContainerElement : function(elm) {
            this._container = elm;
        },

        /** Returns the container where children should be stored. */
        _getContainerElement : function() {
            return this._container;
        },

        /** Returns the container where children should be stored. */
        _getContainerViewType : function() {
            if (!this._container)
                return null;
            var viewType = this._container.data('view') || '';
            return viewType;
        },

    });

    return TemplateDataSetView;
});