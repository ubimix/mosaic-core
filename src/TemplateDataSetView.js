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
    var TemplateDataSetView = DataSetView.extend(TemplateView.prototype, {

        /** Constructor of this class. */
        initialize : function(options) {
            DataSetView.prototype.initialize.apply(this, arguments);
            TemplateView.prototype.initialize.apply(this, arguments);
        },

        /** This method is called when the rendering processes starts. */
        onRenderBegin : function() {
            this.open();
        },

        /** This method is called when this view is removed from the parent. */
        onRemove : function() {
            this.close();
        },

        /** Renders all child views and appends them to the specified element. */
        renderChildren : function(elm) {
            this._setContainerElement(elm);
            this._doRenderChildren();
        },

        /**
         * Renders all children views and appends them to the containers
         * element.
         */
        _doRenderChildren : function() {
            var that = this;
            var container = that._getContainerElement();
            if (!container)
                return;
            var dataSet = that.getDataSet();
            var data = dataSet.getData();
            for (var i = data.length - 1; i >= 0; i--) {
                var d = data[i];
                var key = dataSet.getKey(d);
                var view = that._getView(key);
                if (!view)
                    continue;
                var viewElm = view.getElement();
                var children = container.children();
                var len = children.length;
                if (len) {
                    children.eq(0).before(viewElm);
                } else {
                    container.append(viewElm);
                }
                view.render();
            }
        },

        /** Sets a new container element where child views should be appended. */
        _setContainerElement : function(elm) {
            this._container = elm;
        },

        /** Returns the container where children should be stored. */
        _getContainerElement : function() {
            return this._container;
        },

        /** Updates the view. */
        _onDataSetUpdate : function(e) {
            var that = this;
            var container = that._getContainerElement();
            if (container) {
                DataSetView.prototype._onDataSetUpdate.apply(that, arguments);
                that._doRenderChildren();
            }
            return that;
        },

        /**
         * Sets a new view corresponding to the specified key.
         */
        _setView : function(key, view, idx) {
            var that = this;
            var oldView = that._getView(key);
            DataSetView.prototype._setView.apply(that, arguments);
            if (oldView) {
                oldView.remove();
            }
        },

        /** Sets a new view corresponding to the specified key. */
        _removeView : function(key, view) {
            DataSetView.prototype._removeView.apply(this, arguments);
            view.remove();
            return this;
        },

    });

    return TemplateDataSetView;
});