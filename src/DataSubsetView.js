if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', './DataSetView' ],
// Module
function(require) {

    var DataSetView = require('./DataSetView');

    /** Common superclass for subset views. */
    var DataSubsetView = DataSetView.extend({

        /** Returns a parent view */
        _getParentView : function() {
            var options = this.getOptions();
            return options.parent;
        },

        /** Returns a view corresponding to the specified key. */
        _getView : function(key) {
            var parent = this._getParentView();
            var view = null;
            if (parent && parent._getView) {
                view = parent._getView(key);
            }
            if (!view) {
                view = DataSetView.prototype._getView.call(this, key);
            }
            return view;
        },

    });

    return DataSubsetView;

});
