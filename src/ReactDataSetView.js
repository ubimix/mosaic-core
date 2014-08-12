if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'react', 'mosaic-commons', './DataSetView',
        './ReactDataView' ],
// Module
function(require) {

    var _ = require('underscore');
    var React = require('react');
    var Mosaic = require('mosaic-commons');
    var DataSetView = require('./DataSetView');
    var ReactDataView = require('./ReactDataView');

    var ReactDataSetView = DataSetView.extend(ReactDataView.prototype, {

        initialize : function(options) {
            DataSetView.prototype.initialize.apply(this, arguments);
            ReactView.prototype.initialize.apply(this, arguments);
            if (this.options.renderView) {
                this.renderView = this.options.renderView;
            }
            if (this.options.renderLayout) {
                this.renderLayout = this.options.renderLayout;
            }
        },

        /**
         * Renders individual view from this set. This method should be
         * overloaded in subclasses or re-defined as a constructor "renderView"
         * parameter.
         */
        renderView : function(view) {
            return view && view.render ? view.render() : undefined;
        },

        /**
         * Renders layout for individual dataset views. It takes a list of
         * rendered entities
         */
        renderLayout : function(children) {
            return React.DOM.div(this.options, children);
        },

        /**
         * Render this view. By default it renders all children (using the
         * "renderView" method and after that it calls the "renderLayout" method
         * to organize these items.
         */
        _doRender : function() {
            var that = this;
            var childNodes = [];
            var dataSet = this.getDataSet();
            var data = dataSet.getData();
            _.each(data, function(d) {
                var key = dataSet.getKey(d);
                var view = that._getView(key);
                var rendered = that.renderView(view);
                if (rendered) {
                    childNodes.push(rendered);
                }
            });
            return that.renderLayout(childNodes);
        },

        /**
         * Handles data set notifications and dispatch calls to registered
         * "onEnter", "onUpdate" and "onExit" handlers.
         */
        _onDataSetUpdate : function(e) {
            DataSetView.prototype._onDataSetUpdate.call(this, e);
            this.update();
        }

    });

    return ReactDataSetView;
});