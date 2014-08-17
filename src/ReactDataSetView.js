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
    var DataSetView = require('./DataSetView');

    /**
     * Common superclass for all React-based views responsible for DataSet
     * visualizations. Subclasses should implement the "_onEnter" method and
     * append a "view" field to the entry.
     */
    var ReactDataSetView = DataSetView.extend(ReactDataView.prototype, {
        initialize : function() {
            DataSetView.prototype.initialize.apply(this, arguments);
            ReactDataView.prototype.initialize.apply(this, arguments);
            this.on('update:end', function() {
                this._redraw();
            }, this);
        },

        /**
         * Returns a list of all child views. Each child view should be a
         * subclass of the ReactDataView class.
         */
        getChildViews : function() {
            var list = _.map(this._index, function(entry) {
                var view = entry.view;
                if (!view)
                    return null;
                return view.getElement();
            });
            return list;
        },

    });

    return ReactDataSetView;
});