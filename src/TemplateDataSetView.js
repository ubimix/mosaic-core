
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
            this.on('update:end', _.bind(this._onUpdateEnd, this));
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
        _onEnter : function(entry) {
            var viewManager = this.options.viewManager;
            var viewType = this._getContainerViewType();
            var resourceType = viewManager.getResourceType(entry.obj);
            var options = _.extend({}, this.childOptions, {
                viewManager : viewManager,
                obj : entry.obj,
                parent : this
            });
            entry.view = viewManager.newView(viewType, resourceType, options);
            if (entry.view) {
                entry.view.render();
                entry.view.triggerMethod('create');
            }
            entry.emit('enter');
            return entry;
        },

        /**
         * Destroys a view in the specified index entry. This method should be
         * overloaded in subclasses.
         */
        _onExit : function(entry) {
            if (entry.view) {
                entry.view.remove();
                entry.view.triggerMethod('destroy');
                delete entry.view;
            }
            entry.emit('exit');
            return entry;
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

        /** Appends all rendered entries to the container. */
        _onUpdateEnd : function() {
            var container = this._getContainerElement();
            _.each(this._index, function(entry) {
                container.append(entry.view.$el);
            }, this);
        }

    });

    module.exports = TemplateDataSetView;
